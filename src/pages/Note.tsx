import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FiMenu } from "react-icons/fi";
import { IoText } from "react-icons/io5";
import NoteElementType from "../interfaces/NoteElementType";
import { FaCode } from "react-icons/fa6";
import { FaListUl } from "react-icons/fa";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function Note() {
  const divRef = useRef<HTMLDivElement | null>(null);
  const elemRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [currentType, setCurrentType] = useState<string>();
  const [selectionStart,setSelectionStart] = useState<boolean>();
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [sideBarExapanded, setSideBarExapanded] = useState<boolean>(true);
  const [snippetElements, setSnippetElements] = useState<NoteElementType[]>([
    { id: uuidv4(), type: "Title", content: "", displayCode: false },
  ]);
  const [focusedElementId, setFocusedElementId] = useState<string | null>(null);

  useEffect(() => {
    const handleClick = () => {
      if (elemRef.current && elemRef.current.children.length === 0) {
        let newId = uuidv4();
        let newSnippetEle: NoteElementType = {
          id: newId,
          type: "Text",
          content: "",
          displayCode: false,
        };

        setSnippetElements((prev) => [...prev, newSnippetEle]);

        setTimeout(() => {
          const element = document.querySelector(
            `[data-id = "${newId}"]`
          ) as HTMLDivElement;

          if (element) {
            element.focus();
          }
        }, 0);
      }
    };

    const divElement = divRef.current;

    if (divElement) {
      divElement.addEventListener("click", handleClick);
    }

    return () => {
      if (divElement) {
        divElement.removeEventListener("click", handleClick);
      }
    };
  }, [divRef]);

  const getSideBarClassName = (type: string) => {
    let typeClass = "";
    switch (type) {
      case "Title":
        typeClass = " font-[600] font-mono text-[24px] text-[#ebc583] hover:text-[#ffda99]";
        break;
      case "heading1":
        typeClass = " ml-3 font-[500] font-mono text-[22px] text-[#d9b577] hover:text-[#ffda99]";
        break;
      case "heading2":
        typeClass = " ml-5 font-[450] font-mono text-[20px] text-[#d4b072] hover:text-[#ffda99]";
        break;
      case "heading3":
        typeClass = " ml-7 font-[400] font-mono text-[18px] text-[#d1a964] hover:text-[#ffda99]";
        break;
    }

    return typeClass;
  };

  const getClassName = (type: string) => {
    const baseClass = "p-1 outline-none content-editable-placeholder";

    let typeClass = "";
    switch (type) {
      case "Title":
        typeClass = " text-[#edb045] font-mono font-semibold text-[36px] mt-4 mb-3";
        break;
      case "heading1":
        typeClass = " text-[#f0ad37] font-mono font-[500] text-[28px] mt-2";
        break;
      case "heading2":
        typeClass = " text-[#8a94de] font-mono font-[450] text-[24px] mt-1";
        break;
      case "heading3":
        typeClass = " text-[#808acf] font-mono font-[400] text-xl mt-1";
        break;
      case "bulletList":
        typeClass = " text-[#fceed4] font-mono text-[17px] pl-8";
        break;
      case "todoList":
        typeClass = " text-tlist text-lg list-none pl-6";
        break;
      default:
        typeClass = " text-[#fceed4] font-mona text-[17px]";
    }

    return baseClass + typeClass;
  };

  const handleSidebarNavgation = () => {
    setSideBarExapanded((prev) => !prev);
  };

  const addNewNote = (id: string, type: string) => {
    const newId = uuidv4();

    let selectedType =
      type === null || type === undefined || type === "" ? "Text" : type;

    console.log("Selected Type ---> ", selectedType);

    if (selectedType === "code") {
      selectedType = "Text";
      setCurrentType("Text");
    }

    let newSnippetEle: NoteElementType = {
      id: newId,
      type: selectedType,
      content: "",
      displayCode: false,
    };

    if (id === undefined || id === "Title") {
      setTimeout(() => {
        const element = document.querySelector(
          `[data-id="${newId}"]`
        ) as HTMLDivElement;
        if (element) {
          element.focus();
          const range = document.createRange();
          const selection = window.getSelection();
          range.setStart(element, 0);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);

      setSnippetElements((prev) => [newSnippetEle, ...prev]);
    } else {
      const currentElement = document.querySelector(
        `[data-id = "${id}"]`
      ) as HTMLDivElement;
      const index = snippetElements.findIndex((ele) => ele.id === id);

      if (currentElement) {
        const text = currentElement.innerText || "";
        const selection = window.getSelection();
        const offset = selection?.anchorOffset || 0;

        const split1 = text.substring(0, offset);
        const split2 = text.substring(offset);

        currentElement.innerText = split1;
        newSnippetEle.content = split2;

        setSnippetElements((prev) => {
          const modifiedElements = [
            ...prev.slice(0, index),
            { ...prev[index], content: split1 },
            newSnippetEle,
            ...prev.slice(index + 1),
          ];

          return modifiedElements;
        });

        setTimeout(() => {
          const element = document.querySelector(
            `[data-id="${newId}"]`
          ) as HTMLDivElement;
          if (element) {
            element.innerText = split2;
            element.focus();
            const range = document.createRange();
            const selection = window.getSelection();
            range.setStart(element, 0);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }, 0);
      }
    }
  };

  const cleanFormatting = (id: string) => {
    const eleIdx = snippetElements.findIndex((ele) => ele.id === id);

    if (eleIdx !== -1) {
      setSnippetElements((prev) =>
        prev.map((prev) => {
          if (prev.id === id) {
            prev.type = "Text";
          }
          return prev;
        })
      );
    }

    setCurrentType("Text");
  };

  const handleBackSpace = (event: any, id: string) => {
    let prevIdx = snippetElements.findIndex((ele) => ele.id === id) - 1;

    if (prevIdx < 0) {
      return;
    }

    let prevId = snippetElements[prevIdx].id;

    const curEle = document.querySelector(
      `[data-id = "${id}"]`
    ) as HTMLDivElement;
    const preEle = document.querySelector(
      `[data-id = "${prevId}"]`
    ) as HTMLDivElement;

    if (curEle) {
      const selection = window.getSelection();
      const offset = selection?.anchorOffset || 0;

      if (offset === 0) {
        event.preventDefault();

        let curEleType = curEle.getAttribute("data-type");
        console.log("Cur Element Type ----> ", curEleType);
        if (curEleType && curEleType !== "") {
          if (curEleType !== "Text" && curEleType !== "code") {
            cleanFormatting(id);
            return;
          }
        }
        const curText = curEle.textContent || "";
        const prevText = preEle.textContent || "";
        const prevLen = prevText?.length || 0;

        let filteredList = snippetElements.filter((ele) => ele.id !== id);

        if (preEle) {
          const preEleItem = filteredList.find((ele) => ele.id === prevId);

          if (preEleItem) {
            if (preEleItem.type === "code") {
              filteredList = filteredList.map((ele) =>
                ele.id === prevId
                  ? { ...ele, content: prevText + curText, displayCode: false }
                  : ele
              );
            } else {
              filteredList = filteredList.map((ele) =>
                ele.id === prevId
                  ? { ...ele, content: prevText + curText }
                  : ele
              );
            }
          }

          setSnippetElements(filteredList);

          console.log(filteredList);

          setTimeout(() => {
            if (preEleItem?.type !== "code") {
              preEle.textContent = prevText + curText;

              preEle.focus();

              const range = document.createRange();
              const textNode = preEle.childNodes[0];

              if (textNode) {
                range.setStart(textNode, prevLen);
                range.collapse(true);
                selection?.removeAllRanges();
                selection?.addRange(range);
              }
            }
          }, 0);
        }
      }
    }
  };

  const handleArrowUp = (id: string) => {
    console.log("Arrow up event ----> ")
    const currentIndex = snippetElements.findIndex((ele) => ele.id === id);
    const prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      return;
    }

    const prevElementId = snippetElements[prevIndex].id;
    const prevElement = document.querySelector(
      `[data-id="${prevElementId}"]`
    ) as HTMLDivElement;

    if (prevElement) {
      prevElement.contentEditable = "true";
      prevElement.focus();
    }
  };

  const handleArrowDown = (id: string) => {
    const currentIndex = snippetElements.findIndex((ele) => ele.id === id);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= snippetElements.length) {
      return;
    }

    const nextElementId = snippetElements[nextIndex].id;
    const nextElement = document.querySelector(
      `[data-id="${nextElementId}"]`
    ) as HTMLDivElement;

    if (nextElement) {
      nextElement.focus();
    }
  };

  const handleArrowLeft = (event: any, id: string) => {
    const curEle = document.querySelector(`[data-id="${id}"]`);

    if (curEle) {
      const prevIdx = snippetElements.findIndex((ele) => ele.id === id) - 1;
      const prevId = snippetElements[prevIdx]?.id;

      if (prevIdx < 0) {
        return;
      }

      const selection = document.getSelection();

      if (selection) {
        const offset = selection.anchorOffset;

        if (offset < 1) {
          event.preventDefault();
          const element = document.querySelector(
            `[data-id = "${prevId}"]`
          ) as HTMLDivElement;

          if (element) {
            element.focus();

            const selection = window.getSelection();
            if (selection) {
              const range = document.createRange();
              const textNode = element.childNodes[0];

              let textNodeLen = 0;
              if (textNode) {
                textNodeLen = textNode.textContent?.length || 0;
                range.setStart(textNode, textNodeLen);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }
          }
        }
      }
    }
  };

  const handleArrowRight = (event: any, id: string) => {
    const nextIdx = snippetElements.findIndex((ele) => ele.id === id) + 1;

    if (nextIdx > snippetElements.length) {
      return;
    }

    const selection = window.getSelection();

    if (selection) {
      const offset = selection.anchorOffset;
      const curElement = document.querySelector(
        `[data-id = "${id}"]`
      ) as HTMLDivElement;

      const nextId = snippetElements[nextIdx]?.id;
      const nextElement = document.querySelector(
        `[data-id = "${nextId}"]`
      ) as HTMLDivElement;

      if (nextElement) {
        const textNode = curElement.childNodes[0];
        let textLen = 0;

        if (textNode?.textContent) {
          textLen = textNode.textContent?.length || 0;
        }

        if (offset >= textLen) {
          event.preventDefault();
          nextElement.focus();
        }
      }
    }
  };

  const handleSnippetKeyDown = (
    event: React.KeyboardEvent<HTMLParagraphElement>,
    id: string
  ) => {
    setPopupVisible(false);
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setTimeout(() => addNewNote(id, currentType || "Text"), 0);
    } else if (event.key === "Backspace") {
      handleBackSpace(event, id);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      handleArrowUp(id);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      handleArrowDown(id);
    } else if (event.key === "ArrowLeft") {
      handleArrowLeft(event, id);
    } else if (event.key === "ArrowRight") {
      handleArrowRight(event, id);
    } else if (event.key === "/") {
      handleSlash(event, id);
    }
  };

  const handleElementInput = (event: any, id: string) => {
    const content = event.currentTarget.textContent || "";
    setSnippetElements((elems) => {
      const newElements = elems.map((element) =>
        element.id === id ? { ...element, content } : element
      );
      return newElements;
    });
  };

  const handleSlash = (
    event: React.KeyboardEvent<HTMLDivElement>,
    id: string
  ) => {
    if (event.key === "/") {
      const ele = event.target as HTMLDivElement;
      const rect = ele.getBoundingClientRect();

      setFocusedElementId(id);
      setPopupVisible(true);

      setTimeout(() => {
        const popupHeight = popupRef.current?.offsetHeight || 0;
        const viewportHeight = window.innerHeight;

        let topPosition = rect.bottom + window.scrollY;

        if (rect.bottom + popupHeight > viewportHeight) {
          topPosition = rect.top + window.scrollY - popupHeight;
        }

        setPopupPosition({
          top: topPosition,
          left: rect.left,
        });
      }, 0);

      event.preventDefault();
    }
  };

  const handleOptionSelect = (option: string) => {
    setPopupVisible(false);
    setCurrentType(option);

    const newId = uuidv4();

    let newSnippetEle: NoteElementType = {
      id: newId,
      type: option,
      content: "",
      displayCode: false,
    };

    const currentElement = document.querySelector(
      `[data-id = "${focusedElementId}"]`
    ) as HTMLDivElement;
    const index = snippetElements.findIndex(
      (ele) => ele.id === focusedElementId
    );

    if (currentElement) {
      setSnippetElements((prev) => {
        const modifiedElements = [
          ...prev.slice(0, index + 1),
          newSnippetEle,
          ...prev.slice(index + 1),
        ];

        return modifiedElements;
      });

      setTimeout(() => {
        const element = document.querySelector(
          `[data-id="${newId}"]`
        ) as HTMLDivElement;
        if (element) {
          element.focus();
        }
      }, 0);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();

    if (selection && selection.toString().length > 0) {
      console.log(selection.toString());
    }
  };

  return (
    <>
      <div className="bg-notearea min-h-screen w-full h-screen flex flex-row">
        <div
          className={`h-full transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden ${
            !sideBarExapanded
              ? "w-12 sm:w-16 md:w-20 bg-darkbg"
              : "w-3/4 sm:w-1/2 md:w-1/4 lg:w-1/4 bg-sidebar"
          }`}
        >
          <div className="mt-6 ml-6 w-full h-10 items-end justify-start">
            <FiMenu
              onClick={handleSidebarNavgation}
              className="text-3xl text-gray-400 hover:cursor-pointer hover:text-gray-300 hover:scale-105"
            />
          </div>
          <div className="mt-8 w-full flex flex-col items-center justify-center gap-4">
            <div
              className={`${
                sideBarExapanded ? "block" : "hidden"
              } w-9/10 transition-all ease-in-out duration-100`}
            >
              {snippetElements &&
                snippetElements.map(
                  (ele) =>
                    (ele.type === "Title" ||
                      ele.type === "heading1" ||
                      ele.type === "heading2" ||
                      ele.type === "heading3") &&
                    ele?.content &&
                    ele.content.length > 0 && (
                      <p
                        key={ele.id}
                        className={`p-1 text-ellipsis hover:cursor-pointer ${getSideBarClassName(ele.type)}`}>
                        {ele.content}
                      </p>
                    )
                )}
            </div>
          </div>
        </div>
        <div
          ref={divRef}
          className="flex-1 h-full bg-notearea flex flex-col items-center space-y-4 justify-start overflow-y-auto transition-all duration-300 ease-in-out"
        >
          <div ref={elemRef} className="mb-12 mt-4 w-8/10 flex flex-col">
            {snippetElements.map((snippet) =>
              snippet.type !== "code" ? (
                <div key={snippet.id} className="relative">
                  {snippet.type === "bulletList" && (
                    <GoDotFill className="text-gray-200 absolute left-2 top-2.5" />
                  )}
                  <div
                    data-id={snippet.id}
                    data-type={snippet.type}
                    suppressContentEditableWarning={true}
                    className={`${getClassName(snippet.type)}`}
                    contentEditable={true}
                    autoFocus={true}
                    onBlur={(event : any) => {
                      if(snippet.type !== "Title"){
                        const ele = event.target;
                        ele.contentEditable = false
                      }
                    }}
                    onClick={(event : any) => {
                      if(snippet.type !== "Title"){
                        const ele = event.target;
                        ele.contentEditable = true
                      }
                    }}
                    onKeyDown={(e) => {
                      handleSnippetKeyDown(e, snippet.id);
                    }}
                    onInput={(e) => handleElementInput(e, snippet.id)}
                  />
                </div>
              ) : (
                <div key={snippet.id} data-id={snippet.id}>
                  {snippet.displayCode === false ? (
                    <SyntaxHighlighter
                      key={"editcode" + snippet.id}
                      data-id={"editcode" + snippet.id}
                      language="go"
                      style={gruvboxDark}
                      wrap="true"
                      spellCheck={false}
                      contentEditable
                      suppressContentEditableWarning
                      className="rounded-md outline-none"
                      onKeyDown={(e: any) => {
                        if (e.key === "Backspace") {
                          let innerText = e.target?.innerText || "";
                          innerText = innerText.trim();
                          if (innerText === "") {
                            let pIdx =
                              snippetElements.findIndex(
                                (ele) => ele.id === snippet.id
                              ) - 1;
                            if (pIdx > 0) {
                              let pId = snippetElements[pIdx].id;
                              setSnippetElements((prev) =>
                                prev.filter((ele) => ele.id !== snippet.id)
                              );
                              setCurrentType("Text");
                              setTimeout(() => {
                                const element = document.querySelector(
                                  `[data-id="${pId}"]`
                                ) as HTMLDivElement;
                                element.focus();
                                const range = document.createRange();
                                const textNode = element.childNodes[0];
                                if (textNode) {
                                  let len = textNode.textContent?.length || 0;
                                  range.setStart(textNode, len);
                                  range.collapse(false);
                                }

                                const selection = window.getSelection();
                                if (selection) {
                                  selection.removeAllRanges();
                                  selection.addRange(range);
                                }
                              }, 0);
                            }
                          }
                        }
                      }}
                      onBlur={(e: any) => {
                        const updatedContent = e.target.innerText;
                        setSnippetElements((prev) =>
                          prev.map((ele) =>
                            ele.id === snippet.id
                              ? {
                                  ...ele,
                                  content: updatedContent,
                                  displayCode: true,
                                }
                              : ele
                          )
                        );
                      }}
                    >
                      {snippet.content}
                    </SyntaxHighlighter>
                  ) : (
                    <SyntaxHighlighter
                      key={"code" + snippet.id}
                      data-id={"code" + snippet.id}
                      language="go"
                      style={gruvboxDark}
                      wrap="true"
                      className="rounded-md outline-none"
                      onClick={() => {
                        setSnippetElements((prev) =>
                          prev.map((ele) =>
                            ele.id === snippet.id
                              ? { ...ele, displayCode: false }
                              : ele
                          )
                        );
                      }}
                    >
                      {snippet.content}
                    </SyntaxHighlighter>
                  )}
                </div>
              )
            )}
          </div>
          {popupVisible && (
            <div
              id="typePopup"
              ref={popupRef}
              className="absolute bg-[#1E1E2F] border border-[#44475A] rounded-lg shadow-md p-3 h-fit w-60 z-50"
              style={{
                top: popupPosition.top,
                left: popupPosition.left,
              }}
            >
              <div className="w-full flex flex-col items-stretch space-y-2">
                {[
                  {
                    icon: <FaCode className="text-xl text-[#fa6381]" />,
                    label: "Code",
                    value: "code",
                  },
                  {
                    icon: <LuHeading1 className="text-xl text-[#a974e5]" />,
                    label: "Heading 1",
                    value: "heading1",
                  },
                  {
                    icon: <LuHeading2 className="text-xl text-[#a974e5]" />,
                    label: "Heading 2",
                    value: "heading2",
                  },
                  {
                    icon: <LuHeading3 className="text-xl text-[#a974e5]" />,
                    label: "Heading 3",
                    value: "heading3",
                  },
                  {
                    icon: <IoText className="text-lg text-[#a974e5]" />,
                    label: "Text",
                    value: "Text",
                  },
                  {
                    icon: <FaListUl className="text-lg text-[#757574]" />,
                    label: "Bulleted list",
                    value: "bulletList",
                  },
                ].map(({ icon, label, value }) => (
                  <div
                    key={value}
                    className="p-3 flex items-center rounded-md gap-2 cursor-pointer hover:scale-105 hover:bg-[#4E4E62] transition duration-200"
                    onClick={() => handleOptionSelect(value)}
                  >
                    {icon}
                    <span className="text-[#d7d7c7]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Note;
