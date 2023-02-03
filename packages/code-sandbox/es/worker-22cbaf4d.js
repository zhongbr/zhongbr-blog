const blob = typeof window !== "undefined" && window.Blob && new Blob([atob(encodedJs)], { type: "text/javascript;charset=utf-8" });
function WorkerWrapper() {
  const objURL = blob && (window.URL || window.webkitURL).createObjectURL(blob);
  try {
    return objURL ? new Worker(objURL) : new Worker("data:application/javascript;base64," + encodedJs);
  } finally {
    objURL && (window.URL || window.webkitURL).revokeObjectURL(objURL);
  }
}
export {
  WorkerWrapper as default
};
//# sourceMappingURL=worker-22cbaf4d.js.map