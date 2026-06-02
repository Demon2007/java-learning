import { useRef, useState } from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useProfile } from "@/hooks/useProfile";
import useAuthStore from "@/store/authStore";

export default function AvatarUpload() {
  const { user } = useAuthStore();
  const { avatarMutation, deleteAvatarMutation } = useProfile();
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    const file = inputRef.current?.files[0];
    if (!file) return;
    avatarMutation.mutate(file, { onSuccess: () => setPreview(null) });
  };

  const handleDelete = () => {
    deleteAvatarMutation.mutate();
    setPreview(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar src={preview || user?.avatar_url} name={user?.username} size="2xl" />
        <motion.button
          whileHover={{ opacity: 1 }}
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Camera className="w-8 h-8 text-white" />
        </motion.button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="flex gap-2">
        <Button size="sm" variant="secondary" icon={Camera} onClick={() => inputRef.current?.click()}>
          Change Photo
        </Button>
        {(user?.avatar_url || preview) && (
          <Button size="sm" variant="danger" icon={Trash2} onClick={handleDelete} loading={deleteAvatarMutation.isPending}>
            Remove
          </Button>
        )}
      </div>

      {preview && (
        <Button size="sm" icon={Upload} onClick={handleUpload} loading={avatarMutation.isPending}>
          Upload New Photo
        </Button>
      )}
    </div>
  );
}
