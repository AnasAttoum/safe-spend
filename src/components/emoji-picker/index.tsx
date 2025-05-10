import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

type Props = {
  fieldValue: string;
  onChange: (key: string) => void;
};

export default function EmojiPicker({ fieldValue, onChange }: Props) {
  const theme = useTheme();
  const [openPicker, setOpenPicker] = useState(false);

  return (
    <Popover open={openPicker} onOpenChange={setOpenPicker}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-28">
          {fieldValue ? (
            <span role="img" className="text-6xl">
              {fieldValue}
            </span>
          ) : (
            <div>Click to select</div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-transparent border-0">
        <div className="absolute flex justify-center -bottom-16 -left-8">
          <Picker
            data={data}
            onEmojiSelect={(emoji: { native: string }) => {
              onChange(emoji.native);
              setOpenPicker(false);
            }}
            perLine={9}
            theme={theme.resolvedTheme}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
