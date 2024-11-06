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
  const titleRef = useRef<HTMLDivElement | null>(null);
  const elemRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [currentType, setCurrentType] = useState<string>();
  const [snippetTitle, setSnippetTitle] = useState<string>();
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [sideBarExapanded, setSideBarExapanded] = useState<boolean>(true);
  const [snippetElements, setSnippetElements] = useState<NoteElementType[]>([]);
  const [focusedElementId, setFocusedElementId] = useState<string | null>(null);

  useEffect(() => {
    const handleClick = (event: any) => {
      if (titleRef.current && titleRef.current.contains(event.target)) {
        return;
      }

      if (elemRef.current && elemRef.current.children.length === 0) {
        let newId = uuidv4();
        let newSnippetEle: NoteElementType = {
          id: newId,
          type: "Text",
          content: "",
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
      case "heading1":
        typeClass = " ml-2 text-h1 font-bold text-2xl";
        break;
      case "heading2":
        typeClass = " ml-4 text-h2 font-light text-xl";
        break;
      case "heading3":
        typeClass = " ml-6 text-h3 font-normal text-lg";
        break;
    }

    return typeClass;
  };

  const getClassName = (type: string) => {
    const baseClass = "p-1 outline-none content-editable-placeholder";

    let typeClass = "";
    switch (type) {
      case "heading1":
        typeClass = " text-h1 font-semibold text-3xl mt-4 mb-3";
        break;
      case "heading2":
        typeClass = " text-h2 font-normal text-2xl mt-3 mb-2";
        break;
      case "heading3":
        typeClass = " text-h3 font-normal text-xl mt-1";
        break;
      case "bulletList":
        typeClass = " text-blist text-lg pl-8";
        break;
      case "todoList":
        typeClass = " text-tlist text-lg list-none pl-6";
        break;
      default:
        typeClass = " text-textcol text-[18px]";
    }

    return baseClass + typeClass;
  };

  const handleSidebarNavgation = () => {
    setSideBarExapanded((prev) => !prev);
  };

  const handleTitleInput = (event: any) => {
    setSnippetTitle(event.currentTarget.textContent);
  };

  const addNewNote = (id: string, type: string) => {
    const newId = uuidv4();

    const selectedType =
      type === null || type === undefined || type === "" ? "Text" : type;

    let newSnippetEle: NoteElementType = {
      id: newId,
      type: selectedType,
      content: "",
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

        if (curEleType && curEleType !== "") {
          if (curEleType !== "Text") {
            cleanFormatting(id);
            return;
          }
        }
        const curText = curEle.textContent || "";
        const prevText = preEle.textContent || "";
        const prevLen = prevText?.length || 0;

        setSnippetElements((elems) => elems.filter((ele) => ele.id !== id));

        if (preEle) {
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
      }
    }
  };

  const handleArrowUp = (id: string) => {
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
    id: string,
    type: string
  ) => {
    setPopupVisible(false);
    console.log("Event bubbled ---> ");
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

  const handleKeyDown = (event: any, id: string) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addNewNote("Title", "Text");
    } else if (event.key === "/") {
      const ele = event.target as HTMLDivElement;

      const rect = ele.getBoundingClientRect();

      setPopupPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });

      setPopupVisible(true);

      event.preventDefault();
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

  const handleTextSelection = (event: any) => {
    console.log("Bubbled event ---> ");
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
              : "w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 bg-sidebar"
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
                    (ele.type === "heading1" ||
                      ele.type === "heading2" ||
                      ele.type === "heading3") &&
                    ele?.content &&
                    ele.content.length > 0 && (
                      <p
                        key={ele.id}
                        className={`p-2 text-ellipsis hover:cursor-pointer text-[#b9b9b9] hover:text-[#e1e0e0] ${getSideBarClassName(
                          ele.type
                        )}`}
                      >
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
          <div
            ref={titleRef}
            className={`mt-2 p-1 w-8/10 outline-none text-gray-200`}
          >
            <h1
              spellCheck={true}
              data-content-editable-leaf="true"
              className={`outline-none font-semibold text-4xl text-gray-200 ${
                snippetTitle === "" || snippetTitle === undefined
                  ? "content-editable-placeholder"
                  : ""
              }`}
              contentEditable={true}
              suppressContentEditableWarning={true}
              autoFocus={true}
              data-placeholder="New snippet"
              onInput={handleTitleInput}
              onKeyDown={(event) => handleKeyDown(event, "Title")}
            />
          </div>
          <div ref={elemRef} className="mt-4 w-8/10 flex flex-col">
            {snippetElements.map((snippet) =>
              snippet.type !== "code" ? (
                <div key={snippet.id} className="relative">
                  {snippet.type === "bulletList" && (
                    <GoDotFill className="text-gray-200 absolute left-3 top-3" />
                  )}
                  <div
                    data-id={snippet.id}
                    data-type={snippet.type}
                    contentEditable={true}
                    onMouseUp={handleTextSelection}
                    onSelect={handleTextSelection}
                    suppressContentEditableWarning={true}
                    className={`${getClassName(snippet.type)}`}
                    autoFocus={true}
                    onKeyDown={(e) => {
                      if (snippet.type !== "code") {
                        handleSnippetKeyDown(e, snippet.id, snippet.type);
                      }
                    }}
                    onInput={(e) => handleElementInput(e, snippet.id)}
                  />
                </div>
              ) : (
                <SyntaxHighlighter
                  language="java"
                  className="rounded-md"
                  style={gruvboxDark}
                  showLineNumbers
                  wrap="true"
                  contentEditable
                >
                  {snippet.content}
                </SyntaxHighlighter>
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
                    icon: <IoText className="text-xl text-[#a974e5]" />,
                    label: "Text",
                    value: "Text",
                  },
                  {
                    icon: <FaListUl className="text-xl text-[#757574]" />,
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
