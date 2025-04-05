import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/game"}>Start Game</Link>
    </div>
  );
}
