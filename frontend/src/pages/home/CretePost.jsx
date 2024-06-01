import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { BsEmojiSmileFill } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";



const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const queryClient = useQueryClient();


	const { data } = useQuery({
		queryKey: ['authUser']
	});

	const { mutate: CreatePost, isPending } = useMutation({
		mutationFn: async ({ text, img }) => {

			try {
				const res = await fetch("/api/post/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img }),
				});

				if (!res.ok) {
					throw new Error("Error while creating post");
				}

				return res.json();

			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			setText("");
			setImg(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries('posts');
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});


	const handleSubmit = (e) => {
		e.preventDefault();
		CreatePost({ text, img });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {

			const reader = new FileReader();
			reader.readAsDataURL(file);

			// this is a callback function when the filed is read
			// it will setImg
			reader.onload = () => {
				setImg(reader.result);
			};
		}
	};


	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={data.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							// triggers file selection when clicked
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>
					{/* bind the element with imgRef, imgRef.current points to this element */}
					<input type='file' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
			</form>
		</div>
	);
};
export default CreatePost;