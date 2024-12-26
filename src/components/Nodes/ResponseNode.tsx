import { SerializedCodeNode } from "@lexical/code";
import { EditorConfig, ElementNode, LexicalNode, NodeKey } from "lexical";

export class ResponseNode extends ElementNode {
  private __responseText: string;

  static getType(): string {
    return "custom-response";
  }

  static clone(node: ResponseNode): ResponseNode {
    return new ResponseNode(node.__responseText, node.__key);
  }

  constructor(responseText: string = "", key?: NodeKey) {
    super(key);
    this.__responseText = responseText || "";
  }



  createDOM(): HTMLElement {
    const element = document.createElement("code");
    element.classList.add("custom-response");
    element.textContent = this.__responseText;
    return element;
  }

  exportJSON(): any {
    return {
      type: this.getType(),
      responseText: this.__responseText, 
      children: [],
    };
  }

  static importJSON(serializedNode: any): ResponseNode {
    const { responseText } = serializedNode;
    return new ResponseNode(responseText);  // Create a new instance using the serialized responseText
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    if (prevNode.__responseText !== this.__responseText) {
      dom.textContent = this.__responseText;
      return true;
    }
    return false;
  }
}

export function $createResponseNode(responseText: string = ""): ResponseNode {
  return new ResponseNode(responseText);
}

export function $isResponseNode(
  node: LexicalNode | null | undefined
): node is ResponseNode {
  return node instanceof ResponseNode;
}
