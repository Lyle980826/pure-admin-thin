import { ref, computed } from "vue";
import { analyzeFile, type AnalysisResult } from "../utils/analyzer";

export function useFileUpload() {
  const ruleFormRef = ref();
  const newFormInline = ref({
    title: "新增",
    filename: "",
    fileType: "pdf",
    fileSize: "",
    uploadTime: "",
    remark: "",
    fileList: []
  });

  const analysisResult = ref<AnalysisResult>({
    plates: [],
    plateImages: {},
    totalStats: {
      totalPlates: 0,
      totalObjects: 0,
      totalWeight: 0,
      totalTime: 0
    }
  });

  const activeTab = ref("0");
  const activeStep = ref(0); // 0: 上传, 1: 分析, 2: 完成
  const isAnalyzing = ref(false);
  const uploadRef = ref();

  // 计算当前选中的 plate 数据
  const currentPlate = computed(() => {
    return analysisResult.value.plates[Number(activeTab.value)];
  });

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  async function handleFileChange(_file: any, fileList: any[]) {
    // 更新文件列表
    newFormInline.value.fileList = fileList;

    // 如果有文件，更新文件名、大小和类型
    if (fileList.length > 0) {
      const lastFile = fileList[fileList.length - 1];
      newFormInline.value.filename = lastFile.name;
      newFormInline.value.fileSize = formatFileSize(lastFile.size);
      // 固定文件类型为 3mf
      newFormInline.value.fileType = "3mf";

      // 设置上传时间为当前时间
      newFormInline.value.uploadTime = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }
  }

  async function startAnalysis() {
    if (newFormInline.value.fileList.length === 0) return;

    isAnalyzing.value = true;
    const lastFile =
      newFormInline.value.fileList[newFormInline.value.fileList.length - 1];

    if (lastFile.raw) {
      try {
        const result = await analyzeFile(lastFile.raw);
        analysisResult.value = result;
        // 如果有分盘数据，默认选中第一个
        if (result.plates.length > 0) {
          activeTab.value = "0";
        }
        // 分析完成，进入下一步
        activeStep.value = 1;
      } catch (error) {
        console.error("文件分析失败:", error);
      } finally {
        isAnalyzing.value = false;
      }
    }
  }

  function completeUpload() {
    // 完成上传，进入完成页面
    activeStep.value = 2;
  }

  function backToAnalysis() {
    // 从完成页面返回分析页面
    activeStep.value = 1;
  }

  function backToUpload() {
    // 从分析页面返回上传页面
    activeStep.value = 0;
  }

  function handleObjectClick(object: any) {
    // 这里可以添加物体详情的处理逻辑
    console.log("点击了物体:", object);
    // 例如：显示物体的详细信息弹窗
    // 由于当前数据结构中没有物体的详细信息，暂时只打印日志
  }

  function getRef() {
    return ruleFormRef.value;
  }

  return {
    ruleFormRef,
    newFormInline,
    analysisResult,
    activeTab,
    activeStep,
    isAnalyzing,
    uploadRef,
    currentPlate,
    formatFileSize,
    handleFileChange,
    startAnalysis,
    completeUpload,
    backToAnalysis,
    backToUpload,
    handleObjectClick,
    getRef
  };
}
