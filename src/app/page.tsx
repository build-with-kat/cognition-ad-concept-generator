import Board from "@/components/Board";
import { getBatch } from "@/lib/batch";

export default function Home() {
  return <Board batch={getBatch()} />;
}
