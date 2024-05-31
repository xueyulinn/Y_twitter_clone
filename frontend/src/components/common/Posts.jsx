import { useQuery } from '@tanstack/react-query'
import PostSkeleton from "../skeletons/PostSkeleton";
import Post from "./Post";
import { useEffect } from 'react';

const Posts = ({ feedType }) => {

	const getRequestPath = (feedType) => {
		switch (feedType) {
			case "forYou":
				return "/api/post/all"
			case "following":
				return "/api/post/following"
			default:
				return "/api/post/all"
		}
	}

	const { isLoading, data: POSTS, refetch, isRefetching } = useQuery({
		queryKey: ['posts'],
		queryFn: async () => {
			try {
				const requestPath = getRequestPath(feedType);

				const res = await fetch(requestPath);

				console.log('res', res);

				if (res.status === 404) {
					return [];
				}

				if (!res.ok) {
					throw new Error('Error while fetching posts');
				}

				return res.json();

			} catch (error) {
				console.error(error.message);
				throw new Error('Error while fetching posts');
			}
		},
	});

	useEffect(() => {
		// when feedType changes, refetch the data
		refetch();
	}, [feedType]);

	return (
		<>
			{isLoading || isRefetching && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && POSTS && (
				<div>
					{POSTS.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;