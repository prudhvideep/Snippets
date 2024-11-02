import { useState } from "react";
import FormattedInputType from "../interfaces/FormattedInputType";

function FormattedInput({ type, onKeyDown, onChange }: FormattedInputType) {
  let placeHolder: string = "Write something";
  let baseClass: string =
    "p-2 text-wrap w-full outline-none bg-graybg text-gray-200";
  let typeStyle: string = "";

  const [focused,setFocused] = useState<boolean>(false)

  switch (type) {
    case "Title":
      typeStyle = "font-semibold text-4xl h-16";
      placeHolder = "New Snippet";
      break;
    case "h1":
      typeStyle = "font-medium text-2xl h-12";
      placeHolder = "Heading 1";
      break;
    case "h2":
      typeStyle = "font-medium text-xl h-10";
      placeHolder = "Heading 2";
      break;
    case "p":
      typeStyle = "font-normal text-md h-8 text-wrap";
      placeHolder = "Write something";
      break;
    default:
      typeStyle = "font-normal text-md h-8 text-wrap";
      placeHolder = "Write something";
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  return (

    <input
      type="text"
      className={`${baseClass} ${typeStyle}`}
      placeholder={(focused || type === "Title") ? placeHolder : ""}
      autoFocus={true}
      onKeyDown={handleKeyDown}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default FormattedInput;
