import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { FiMenu } from "react-icons/fi";
import NoteElementType from "../interfaces/NoteElementType";
import { BiEnvelope } from "react-icons/bi";

function Note() {
  const [sideBarExapanded, setSideBarExapanded] = useState(true);
  const [snippetTitle, setSnippetTitle] = useState<string>();
  const [snippetElements, setSnippetElements] = useState<NoteElementType[]>([]);

  const handleSidebarNavgation = () => {
    setSideBarExapanded((prev) => !prev);
  };

  const handleTitleInput = (event: any) => {
    setSnippetTitle(event.currentTarget.textContent);
  };

  const addNewNote = (id: string) => {
    const newId = uuidv4();

    let newSnippetEle: NoteElementType = {
      id: newId,
      type: "",
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

              const textNodeLen = textNode.textContent?.length || 0;

              range.setStart(textNode, textNodeLen);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
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
        const textLen = textNode.textContent?.length || 0;

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
    console.log(event.key);
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      addNewNote(id);
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
    }
  };

  const handleKeyDown = (event: any, id: string) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addNewNote(id);
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

  return (
    <>
      <div className="bg-graybg min-h-screen min-w-full w-full h-screen flex flex-row">
        <div
          className={`h-full transition-all duration-300 ease-in-out ${
            !sideBarExapanded
              ? "w-1/10 md:w-0.5/10 bg-graybg"
              : "w-5/10 sm:w-4/10 md:w-2/10 bg-zinc-800"
          }`}
        >
          <div className="mt-6 ml-6 w-full h-10 items-end justify-start">
            <FiMenu
              onClick={handleSidebarNavgation}
              className="text-3xl text-gray-400 hover:cursor-pointer hover:text-gray-300 hover:scale-105"
            />
          </div>
        </div>
        <div className="w-8/10 h-full bg-graybg flex flex-col items-center space-y-4 justify-start overflow-y-auto">
          <div className="mt-2 p-1 w-8/10 outline-none text-gray-200">
            <h1
              spellCheck={true}
              data-content-editable-leaf="true"
              className={`outline-none text-4xl ${
                snippetTitle === "" || snippetTitle === undefined
                  ? "content-editable-placeholder"
                  : ""
              }`}
              contentEditable={true}
              suppressContentEditableWarning={true}
              autoFocus={true}
              data-placeholder="New page"
              onInput={handleTitleInput}
              onKeyDown={(event) => handleKeyDown(event, "Title")}
            />
          </div>
          <div className="w-8/10 flex flex-col">
            {snippetElements.map((snippet) => (
              <div
                aria-placeholder="sdfdssdf"
                key={snippet.id}
                data-id={snippet.id}
                contentEditable={true}
                suppressContentEditableWarning={true}
                className=" p-1 text-gray-200 outline-none content-editable-placeholder"
                autoFocus={true}
                onKeyDown={(e) => handleSnippetKeyDown(e, snippet.id)}
                onInput={(e) => handleElementInput(e, snippet.id)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Note;
