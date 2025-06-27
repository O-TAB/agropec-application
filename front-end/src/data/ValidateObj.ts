import { point} from "./ObjectStructures";

export function isPoint(obj: any): obj is point {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.x === "number" &&
    typeof obj.y === "number" &&
    typeof obj.typePoint === "string"
  );
}
