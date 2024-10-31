import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FiMenu } from "react-icons/fi";
import FormattedInput from "../components/FormattedInput";
import NoteElementType from "../interfaces/NoteElementType";

function Note() {
  const [sideBarExapanded, setSideBarExapanded] = useState(true);
  const [noteElements, setNoteElements] = useState<NoteElementType[]>([]);

  const handleSidebarNavgation = () => {
    setSideBarExapanded((prev) => !prev);
  };

  const addNewNoteElement = (index: number) => {
    console.log("index ----> ", index);

    let noteElement: NoteElementType = {
      id: uuidv4(),
      type: "p",
      content: "",
    };

    if (index === -1) {
      setNoteElements((prev) => [noteElement, ...prev]);
      return;
    }

    console.log(noteElements);
    setNoteElements((prev) => [
      ...prev.slice(0, index),
      noteElement,
      ...prev.slice(index),
    ]);
  };

  const updateContent = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value)

    setNoteElements((prev) => {
      const index = prev.findIndex((ele) => ele.id === id)
      
      return prev
    })
  };

  return (
    <>
      <div className="min-h-screen min-w-full w-full h-screen bg-graybg flex flex-row overflow-scroll">
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
        <div className="w-8/10 h-full bg-graybg flex flex-col items-center space-y-4 justify-start">
          <div className="p-2 w-8/10">
            <FormattedInput
              key="Title"
              type="Title"
              onKeyDown={() => addNewNoteElement(-1)}
            />
          </div>
          <div className="p-2 w-8/10 flex flex-col space-y-2">
            {noteElements.map((element, index) => (
              <FormattedInput
                key={element.id}
                type={`${element.type}`}
                onKeyDown={() => addNewNoteElement(index)}
                onChange={(event) => updateContent(element.id, event)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Note;
