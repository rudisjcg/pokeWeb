import Link from "next/link";
import { strings } from "@/lib/strings";

export default function NotFound() {
  return (
    <div>
      <h1>{strings.errors.notFoundCode}</h1>
      <h1>{strings.errors.notFoundTitle}</h1>
      <Link href="/">{strings.errors.backHome}</Link>
    </div>
  );
}
