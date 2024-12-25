
self.onmessage = function(event) {
  try{
   const result = eval(event.data)
   self.postMessage({result : result})
  }catch (error) {
    self.postMessage({error : error.message})
  }
};
