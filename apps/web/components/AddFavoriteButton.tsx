import { strings } from "@/lib/strings";

export default function AddFavoriteButton() {
  return (
    <button type="button" disabled className="border p-2 rounded-lg">
      {strings.pokemon.add}
    </button>
  );
}
