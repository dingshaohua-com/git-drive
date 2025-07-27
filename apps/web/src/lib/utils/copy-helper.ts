function fallbackCopyText(text:string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    console.log("复制成功（降级方案）");
  } catch (err) {
    console.error("复制失败:", err);
  }
  document.body.removeChild(textarea);
}

async function copyToClipboard(text:string) {
  if (!navigator.clipboard) {
    fallbackCopyText(text); // 降级方案
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    console.log("复制成功！");
  } catch (err) {
    console.error("复制失败:", err);
    fallbackCopyText(text); // 降级方案
  }
}

 export default copyToClipboard;
