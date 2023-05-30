import { useFetcher, useLocation } from "@remix-run/react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

type Props = {
	id: string;
	likes: number;
	dislikes: number;
};

export function LikeDislike(props: Props) {
	const { Form, data, state, formData } = useFetcher();
	const location = useLocation();

	const isLikeAction = !!formData && formData.get("action") === "LIKE";
	const isDislikeAction = !!formData && formData.get("action") === "DISLIKE"

	// Use fresh data returned from the ActionFunction, if a mutation has just finished
	const isDone = state === "idle" && data !== null;
	const isWorking = state === "loading" || state === "submitting";

	const likes = isDone && Number(data?.likes) ? data.likes : props.likes;
	const optimisticLikes = isLikeAction ? likes + 1 : likes;
	const displayLikes = optimisticLikes || likes;

	const dislikes = isDone && Number(data?.dislikes) ? data.dislikes : props.dislikes;
	const optimisticDislikes = isDislikeAction ? dislikes + 1 : dislikes;
	const displayDislikes = optimisticDislikes || dislikes;

	return (
		<Form
			action={location.pathname}
			className="flex items-center justify-center gap-4 bg-black text-white"
			method="post"
		>
			<input name="id" type="hidden" value={props.id} />
			<button
				name="action"
				type="submit"
				value="LIKE"
				disabled={isWorking}
				className="flex items-center gap-2 bg-black p-4 transition-all duration-100 ease-in-out hover:bg-cyan-400 hover:text-black disabled:opacity-50"
				title="Like"
			>
				<span className="text-xs font-bold">{displayLikes}</span>
				<ThumbsUp />
				<span className="sr-only">Like</span>
			</button>
			<button
				name="action"
				type="submit"
				value="DISLIKE"
				disabled={isWorking}
				className="flex items-center gap-2 bg-black p-4 transition-all duration-100 ease-in-out hover:bg-cyan-400 hover:text-black disabled:opacity-50"
				title="Dislike"
			>
				<ThumbsDown />
				<span className="text-xs font-bold">{displayDislikes}</span>
				<span className="sr-only">Dislike</span>
			</button>
		</Form>
	);
}
