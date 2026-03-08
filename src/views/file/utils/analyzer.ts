import JSZip from "jszip";

// 分盘信息接口
export interface PlateInfo {
  index: number;
  name: string;
  metadata: Record<string, string>;
  objects: ObjectInfo[];
  filaments: FilamentInfo[];
  totalFilamentWeight: number;
  hasGcode: boolean;
  status: string;
  thumbnailFile?: string;
  gcodeFile?: string;
  warnings?: WarningInfo[];
}

// 对象信息接口
export interface ObjectInfo {
  identify_id: string;
  name: string;
  skipped: boolean;
}

// 耗材信息接口
export interface FilamentInfo {
  id: string;
  tray_info_idx: string;
  type: string;
  color: string;
  used_m: number;
  used_g: number;
}

// 警告信息接口
export interface WarningInfo {
  msg: string;
  level: string;
  error_code: string;
}

// 分析结果接口
export interface AnalysisResult {
  plates: PlateInfo[];
  plateImages: Record<number, string>;
  totalStats: {
    totalPlates: number;
    totalObjects: number;
    totalWeight: number;
    totalTime: number;
  };
}

/**
 * 分析3MF或ZIP文件，提取分盘信息
 * @param file 要分析的文件
 * @returns 分析结果
 */
export async function analyzeFile(file: File): Promise<AnalysisResult> {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const result: AnalysisResult = {
    plates: [],
    plateImages: {},
    totalStats: {
      totalPlates: 0,
      totalObjects: 0,
      totalWeight: 0,
      totalTime: 0
    }
  };

  if (fileExtension === "3mf" || fileExtension === "zip") {
    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);

      console.log("ZIP文件内容:", Object.keys(content.files));

      // 收集所有需要处理的文件
      const filesToProcess = [];
      for (const fileName in content.files) {
        if (!content.files[fileName].dir) {
          filesToProcess.push(fileName);
        }
      }

      // 先处理所有图片文件，确保图片加载完成
      for (const fileName of filesToProcess) {
        if (fileName.match(/Metadata\/plate_\d+\.png/)) {
          const plateNumber = parseInt(fileName.match(/plate_(\d+)\.png/)[1]);
          const fileContent = await content.files[fileName].async("base64");
          const imageUrl = `data:image/png;base64,${fileContent}`;
          result.plateImages[plateNumber] = imageUrl;
          console.log(`分盘 ${plateNumber} 图片已加载`);
        }
      }

      // 处理配置文件
      let hasSliceInfo = false;
      let hasModelSettings = false;
      let sliceInfoData: PlateInfo[] = [];
      let modelSettingsData: PlateInfo[] = [];

      // 先收集所有配置文件的内容
      // 先处理model_settings.config文件
      for (const fileName of filesToProcess) {
        if (fileName.includes("model_settings.config")) {
          const fileContent = await content.files[fileName].async("text");
          console.log("找到model_settings.config文件");
          modelSettingsData = parseModelSettingsConfig(fileContent);
          hasModelSettings = true;
        }
      }

      // 再处理slice_info.config文件
      for (const fileName of filesToProcess) {
        if (fileName.includes("Metadata/slice_info.config")) {
          const fileContent = await content.files[fileName].async("text");
          console.log("找到slice_info.config文件");
          sliceInfoData = parseSliceInfoConfig(fileContent);
          hasSliceInfo = true;
        }
      }

      // 合并分盘信息
      if (hasSliceInfo && hasModelSettings) {
        console.log("合并slice_info.config和model_settings.config的分盘信息");
        // 使用model_settings.config的分盘数据作为基础，合并slice_info.config的详细信息
        result.plates = modelSettingsData.map(modelPlate => {
          const slicePlate = sliceInfoData.find(
            slicePlate => slicePlate.index === modelPlate.index
          );
          if (slicePlate) {
            return {
              ...modelPlate,
              metadata: {
                ...modelPlate.metadata,
                ...slicePlate.metadata
              },
              objects: slicePlate.objects,
              filaments: slicePlate.filaments,
              totalFilamentWeight: slicePlate.totalFilamentWeight,
              warnings: slicePlate.warnings
            };
          }
          return modelPlate;
        });
        // 按照分盘ID排序
        result.plates.sort((a, b) => a.index - b.index);
        console.log("合并后的分盘信息:", result.plates);
      } else if (hasSliceInfo) {
        console.log("只使用slice_info.config的分盘信息");
        sliceInfoData.sort((a, b) => a.index - b.index);
        result.plates = sliceInfoData;
      } else if (hasModelSettings) {
        console.log("只使用model_settings.config的分盘信息");
        modelSettingsData.sort((a, b) => a.index - b.index);
        result.plates = modelSettingsData;
      } else {
        // 如果没有找到任何配置文件，尝试直接解析根目录下的config文件
        console.log("未找到配置文件，尝试解析根目录下的config文件");
        for (const fileName of filesToProcess) {
          if (fileName.endsWith(".config")) {
            const fileContent = await content.files[fileName].async("text");
            console.log("找到config文件:", fileName);
            if (fileContent.includes("<slice_info")) {
              // 解析slice_info.config
              const configData = parseSliceInfoConfig(fileContent);
              configData.sort((a, b) => a.index - b.index);
              result.plates = configData;
            } else if (fileContent.includes("<config")) {
              // 解析model_settings.config
              const configData = parseModelSettingsConfig(fileContent);
              configData.sort((a, b) => a.index - b.index);
              result.plates = configData;
            }
          }
        }
      }

      // 计算总统计信息
      calculateTotalStats(result);

      console.log("ZIP文件解析完成");
      console.log("最终分盘信息:", result.plates);
    } catch (error) {
      console.error("ZIP文件解析失败:", error);
    }
  } else if (fileExtension === "config") {
    // 直接解析config文件
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target?.result;
      if (typeof content === "string") {
        console.log("config文件内容:", content);
        console.log("文件包含<config>: ", content.includes("<config"));
        console.log("文件包含<slice_info>: ", content.includes("<slice_info"));
        // 根据文件内容判断是哪种配置文件
        if (content.includes("<slice_info")) {
          console.log("解析为slice_info.config");
          result.plates = parseSliceInfoConfig(content);
        } else if (content.includes("<config")) {
          console.log("解析为model_settings.config");
          result.plates = parseModelSettingsConfig(content);
        } else {
          console.log("无法识别的配置文件格式");
        }
        // 计算总统计信息
        calculateTotalStats(result);
      }
    };
    reader.readAsText(file);
  }

  return result;
}

/**
 * 解析model_settings.config XML文件
 * @param xmlContent XML内容
 * @returns 分盘信息数组
 */
function parseModelSettingsConfig(xmlContent: string): PlateInfo[] {
  // 解析model_settings.config XML文件
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

    // 检查解析是否成功
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      console.error("XML解析错误:", parserError.textContent);
      return [];
    }

    // 提取plate信息
    const plates = xmlDoc.querySelectorAll("plate");
    console.log("找到的分盘数量:", plates.length);
    console.log("分盘元素:", plates);
    const platesData: PlateInfo[] = [];

    plates.forEach(plate => {
      const metadata: Record<string, string> = {};
      let plateId = 0;
      let plateName = "";
      let thumbnailFile = "";
      let gcodeFile = "";

      const metadataItems = plate.querySelectorAll("metadata");
      metadataItems.forEach(item => {
        const key = item.getAttribute("key");
        const value = item.getAttribute("value");
        if (key && value) {
          metadata[key] = value;
          if (key === "plater_id") {
            plateId = parseInt(value);
          } else if (key === "plater_name" && value) {
            plateName = value;
          } else if (key === "thumbnail_file") {
            thumbnailFile = value;
          } else if (key === "gcode_file") {
            gcodeFile = value;
          }
        }
      });

      // 如果分盘名称为空，使用默认名称
      if (!plateName) {
        plateName = `分盘 ${plateId}`;
      }

      const hasGcode = !!gcodeFile;
      const status = hasGcode ? "已切片" : "未切片";

      platesData.push({
        index: plateId,
        name: plateName,
        metadata,
        objects: [],
        filaments: [],
        totalFilamentWeight: 0,
        hasGcode,
        status,
        thumbnailFile,
        gcodeFile
      });
    });

    // 按照plater_id排序，确保分盘顺序正确
    return platesData.sort((a, b) => a.index - b.index);
  } catch (error) {
    console.error("解析model_settings.config失败:", error);
    return [];
  }
}

/**
 * 解析slice_info.config XML文件
 * @param xmlContent XML内容
 * @returns 分盘信息数组
 */
function parseSliceInfoConfig(xmlContent: string): PlateInfo[] {
  // 解析slice_info.config XML文件
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

    // 提取header信息
    const headerItems = xmlDoc.querySelectorAll("header header_item");
    const headerInfo: Record<string, string> = {};
    headerItems.forEach(item => {
      const key = item.getAttribute("key");
      const value = item.getAttribute("value");
      if (key && value) {
        headerInfo[key] = value;
      }
    });
    console.log("Header信息:", headerInfo);

    // 提取plate信息
    const plates = xmlDoc.querySelectorAll("plate");
    const platesData: PlateInfo[] = [];

    plates.forEach((plate, index) => {
      const metadataItems = plate.querySelectorAll("metadata");
      const metadata: Record<string, string> = {};
      let plateName = `分盘 ${index + 1}`;
      let plateId = index + 1; // 默认使用数组索引+1作为分盘ID

      metadataItems.forEach(item => {
        const key = item.getAttribute("key");
        const value = item.getAttribute("value");
        if (key && value) {
          metadata[key] = value;
          // 尝试获取分盘名称
          if (key === "plater_name" && value) {
            plateName = value;
          } else if (key === "plater_id" || key === "index") {
            plateId = parseInt(value); // 如果有plater_id或index，使用它作为分盘ID
          }
        }
      });

      // 提取object信息
      const objects: ObjectInfo[] = [];
      const objectElements = plate.querySelectorAll("object");
      objectElements.forEach(obj => {
        objects.push({
          identify_id: obj.getAttribute("identify_id") || "",
          name: obj.getAttribute("name") || "",
          skipped: obj.getAttribute("skipped") === "true"
        });
      });

      // 提取filament信息
      const filaments: FilamentInfo[] = [];
      const filamentElements = plate.querySelectorAll("filament");
      filamentElements.forEach(filament => {
        filaments.push({
          id: filament.getAttribute("id") || "",
          tray_info_idx: filament.getAttribute("tray_info_idx") || "",
          type: filament.getAttribute("type") || "",
          color: filament.getAttribute("color") || "",
          used_m: parseFloat(filament.getAttribute("used_m") || "0"),
          used_g: parseFloat(filament.getAttribute("used_g") || "0")
        });
      });

      // 计算分盘耗材总重量
      let totalFilamentWeight = 0;
      filaments.forEach(filament => {
        totalFilamentWeight += filament.used_g || 0;
      });

      // 提取warning信息
      const warnings: WarningInfo[] = [];
      const warningElements = plate.querySelectorAll("warning");
      warningElements.forEach(warning => {
        warnings.push({
          msg: warning.getAttribute("msg") || "",
          level: warning.getAttribute("level") || "",
          error_code: warning.getAttribute("error_code") || ""
        });
      });

      platesData.push({
        index: plateId,
        name: plateName,
        metadata,
        objects,
        filaments,
        totalFilamentWeight,
        hasGcode: true,
        status: "已切片",
        warnings
      });
    });

    // 按照plater_id排序，确保分盘顺序正确
    return platesData.sort((a, b) => a.index - b.index);
  } catch (error) {
    console.error("解析slice_info.config失败:", error);
    return [];
  }
}

/**
 * 计算总统计信息
 * @param result 分析结果
 */
function calculateTotalStats(result: AnalysisResult): void {
  let totalTime = 0;
  let totalWeight = 0;
  let totalObjects = 0;

  result.plates.forEach(plate => {
    const prediction = parseFloat(plate.metadata.prediction || "0");
    totalTime += prediction;
    totalWeight += plate.totalFilamentWeight;
    totalObjects += plate.objects?.length || 0;
  });

  result.totalStats = {
    totalPlates: result.plates.length,
    totalObjects,
    totalWeight,
    totalTime
  };

  console.log("总打印时间:", totalTime, "秒");
  console.log("总耗材使用量:", totalWeight, "克");
  console.log("总对象数量:", totalObjects, "个");
  console.log("总分盘数量:", result.plates.length, "个");
}
