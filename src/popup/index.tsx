import copy from "copy-to-clipboard";
import { Fragment, useCallback } from "react";
import "~style.css";

export type Format = {
  name: string;
  type: string;
  fn: (title: string, url: string) => string;
};

export const formats: Format[] = [
  {
    name: "URL",
    type: "text/plain",
    fn: (_, url) => url,
  },
  {
    name: "Title",
    type: "text/plain",
    fn: (title, _) => title,
  },
  {
    name: "Markdown",
    type: "text/plain",
    fn: (title, url) => `[${title}](${url})`,
  },
  {
    name: "Rich Text Link",
    type: "text/html",
    fn: (title, url) => `<a href="${url}">${title}</a>`,
  },
];

export default function Popup() {
  return (
    <div>
      {formats.map((format, i) => (
        <Fragment key={format.name}>
          {i !== 0 && <hr className="border-gray-600" />}

          <CopyButton format={format} />
        </Fragment>
      ))}
    </div>
  );
}

type CopyButtonProps = {
  format: Format;
};

function CopyButton({ format }: CopyButtonProps) {
  const handleClick = useCallback(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const { title, url } = tabs[0];

      const text = format.fn(title, url);
      copy(text, {
        format: format.type,
        onCopy: () => window.close(),
      });
    });
  }, [format]);

  return (
    <button
      className="w-full whitespace-nowrap bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
      type="button"
      onClick={handleClick}
    >
      {format.name}
    </button>
  );
}
