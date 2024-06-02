import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';


const useUpdateProfile = () => {

    const queryClient = useQueryClient();

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: async (formData) => {

            try {
                const res = await fetch('/api/user/updateProfile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();

                console.log('data', data);

                if (!res.ok) {
                    throw new Error(data.message);
                }

                return data;

            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["profile"]);
            toast.success('Profile updated successfully');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });


    return ({ updateProfile, isPending });
}

export default useUpdateProfile