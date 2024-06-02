import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';


const useFollow = () => {
    const queryClient = useQueryClient();

    const { mutate: follow, isPending } = useMutation({
        mutationFn: async (targetId) => {
            try {
                const res = await fetch(`/api/user/follow/${targetId}`, {
                    method: 'POST',
                });

                if (!res.ok) {
                    throw new Error('An error occurred while following user');
                }

                return res.json();
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            // ensure every invalidated query is completed
            Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["suggestedUsers"]
                }),
                queryClient.invalidateQueries({
                    queryKey: ["authUser"]
                }),
                queryClient.invalidateQueries({
                    queryKey: ["profile"]
                }),
            ])
        },

        onError: (error) => {
            toast.error(error.message);
        }
    });

    return (
        { follow, isPending }
    )
}

export default useFollow;