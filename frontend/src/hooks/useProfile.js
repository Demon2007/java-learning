import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import authService from "@/services/auth.service";
import useAuthStore from "@/store/authStore";

export function useProfile() {
  const { setUser, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await authService.getProfile();
      setUser(res.data.data);
      return res.data.data;
    },
    staleTime: 30000,
  });

  const updateMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (res) => {
      updateUser(res.data.data);
      queryClient.setQueryData(["profile"], res.data.data);
      toast.success("Profile updated!");
    },
    onError: () => toast.error("Failed to update profile."),
  });

  const avatarMutation = useMutation({
    mutationFn: authService.uploadAvatar,
    onSuccess: (res) => {
      updateUser(res.data.data);
      queryClient.setQueryData(["profile"], res.data.data);
      toast.success("Avatar updated!");
    },
    onError: () => toast.error("Failed to upload avatar."),
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: authService.deleteAvatar,
    onSuccess: () => {
      updateUser({ avatar_url: null });
      toast.success("Avatar removed.");
    },
  });

  return { profile, isLoading, updateMutation, avatarMutation, deleteAvatarMutation };
}
