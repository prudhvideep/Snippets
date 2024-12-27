self.onmessage = function (event) {
  const code = event.data;

  const logs = [];

  const originalConsoleLog = console?.log || (() => {});

  console.log = (...args) => {
    const logMessage = args.join(" ");
    logs.push(logMessage); 
    originalConsoleLog(...args); 
  };

  try {
    const result = new Function(`
      ${code}
    `)();

    console.log = originalConsoleLog;

    self.postMessage({
      result: result,
      logs: logs,
    });
  } catch (error) {
    console.log = originalConsoleLog;
    self.postMessage({
      error: error.message,
      logs: logs,
    });
  }
};
