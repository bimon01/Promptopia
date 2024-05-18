import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { IPost } from "../../types/Type";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUpload } from "@src/hooks/use-upload";
import Image from "next/image";
import { SendIcon, Tag } from "lucide-react";

type DialogFormProps = {
  open: boolean;
  onClose: () => void;
  post?: IPost | null;
  onSubmit: (postData: Partial<IPost>) => void;
  id?: string;
};

const DialogForm: React.FC<DialogFormProps> = ({
  open,
  onClose,
  post,
  onSubmit,
  id,
}) => {
  const {
    handleFileChange,
    selectedImage,
    selectedAudio,
    isImageUploading,
    isAudioUploading,
    isSubmitting,
    handleTagInputBlur,
    formData,
    audioObjectUrl,
    handleFileRemove,
    handleSubmit,
    updateFormData,
    removeTag,
    handleAddTag,
    handleTagInputChange,
  } = useUpload({
    post,
    id,
    onSubmit,
    onClose,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-800 dark:text-gray-100 sm:p-6">
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <DialogTitle>{id ? "Edit Post" : "Create Post"}</DialogTitle>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <MessageInput
                name="message"
                value={formData.message}
                onChange={updateFormData}
              />
              <TagInput
                onKeyDown={handleTagInputChange}
                onBlur={handleTagInputBlur}
                onAddTag={handleAddTag}
                isSubmitting={isSubmitting}
              />
              <TagList tags={formData.tag} onRemoveTag={removeTag} />
              <div className="flex flex-col gap-4">
                <MediaPreviews
                  selectedImage={selectedImage}
                  selectedAudio={selectedAudio}
                  audioObjectUrl={audioObjectUrl}
                />
                <div className="flex flex-wrap justify-center gap-4">
                  {selectedImage && (
                    <button
                      type="button"
                      onClick={() => handleFileRemove("image")}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove Image
                    </button>
                  )}
                  {selectedAudio && (
                    <button
                      type="button"
                      onClick={() => handleFileRemove("audio")}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove Audio
                    </button>
                  )}
                </div>
              </div>
              <FileUpload
                onImageUpload={handleFileChange("image")}
                onAudioUpload={handleFileChange("audio")}
                isImageUploading={isImageUploading}
                isAudioUploading={isAudioUploading}
                selectedImage={selectedImage}
                selectedAudio={selectedAudio}
              />
              <DialogFooter>
                <SubmitButton
                  isSubmitting={isSubmitting}
                  isImageUploading={isImageUploading}
                  isAudioUploading={isAudioUploading}
                />
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Extracted sub-components

const MessageInput: React.FC<{
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ name, value, onChange }) => {
  const [rows, setRows] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRows(4);
      } else {
        setRows(8);
      }
    };

    handleResize(); // Call once on mount
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Textarea
      name={name}
      placeholder="Enter your message here"
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full overflow-auto"
    />
  );
};

const TagInput: React.FC<{
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onAddTag: () => void;
  isSubmitting: boolean;
}> = ({ onKeyDown, onBlur, onAddTag, isSubmitting }) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
    <Input
      name="tag"
      id="tagInput"
      type="text"
      placeholder="Write a tag"
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      className="w-full sm:w-auto"
    />
    <Button
      variant="outline"
      type="button"
      onClick={onAddTag}
      disabled={isSubmitting}
      className="self-start rounded px-4 py-2 font-bold hover:bg-gray-100 dark:text-white"
    >
      Add <Tag className="ml-1" size={16} />
    </Button>
  </div>
);

const TagList: React.FC<{
  tags: string[];
  onRemoveTag: (tag: string) => void;
}> = ({ tags, onRemoveTag }) => (
  <div className="flex flex-wrap gap-2">
    {Array.isArray(tags) &&
      tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-1 rounded bg-gray-200 px-2 py-1"
        >
          {typeof tag === "string" && (
            <>
              <div>{tag}</div>
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="text-red-500 hover:text-red-700"
              >
                x
              </button>
            </>
          )}
        </div>
      ))}
  </div>
);

const MediaPreviews: React.FC<{
  selectedImage: File | null;
  selectedAudio: File | null;
  audioObjectUrl: string | null;
}> = ({ selectedImage, selectedAudio, audioObjectUrl }) => (
  <div className="flex flex-col gap-4">
    {selectedImage && (
      <div className="flex flex-col items-center gap-2">
        <Image
          width={200}
          height={200}
          src={URL.createObjectURL(selectedImage)}
          alt="Preview"
          className="h-auto w-1/2 sm:w-full"
        />
      </div>
    )}
    {selectedAudio && (
      <div className="flex flex-col gap-2">
        <audio
          src={audioObjectUrl || undefined}
          controls
          preload="auto"
          className="w-full"
        />
      </div>
    )}
  </div>
);

const FileUpload: React.FC<{
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAudioUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isImageUploading: boolean;
  isAudioUploading: boolean;
  selectedImage: File | null;
  selectedAudio: File | null;
}> = ({
  onImageUpload,
  onAudioUpload,
  isImageUploading,
  isAudioUploading,
  selectedImage,
  selectedAudio,
}) => (
  <div className="flex flex-wrap justify-center gap-4">
    {!selectedImage && (
      <label htmlFor="imageUpload" className="cursor-pointer">
        {isImageUploading ? "Uploading..." : "Upload Image"}
        <Input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageUpload}
        />
      </label>
    )}
    {!selectedAudio && (
      <label htmlFor="audioUpload" className="cursor-pointer">
        {isAudioUploading ? "Uploading..." : "Upload Audio"}
        <Input
          id="audioUpload"
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={onAudioUpload}
        />
      </label>
    )}
  </div>
);

const SubmitButton: React.FC<{
  isSubmitting: boolean;
  isImageUploading: boolean;
  isAudioUploading: boolean;
}> = ({ isSubmitting, isImageUploading, isAudioUploading }) => (
  <Button
    type="submit"
    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    disabled={isSubmitting || isImageUploading || isAudioUploading}
  >
    {isSubmitting ? (
      "Submitting..."
    ) : (
      <>
        Submit <SendIcon className="ml-2 h-4 w-4" />
      </>
    )}
  </Button>
);

export default DialogForm;
