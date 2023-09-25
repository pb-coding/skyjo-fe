import { FC } from "react";

export const ConnectedIndicator: FC = () => (
  <span className="ml-2 flex w-2.5 h-2.5 bg-green-500 rounded-full"></span>
);

export const DisconnectedIndicator: FC = () => (
  <span className="ml-2 flex w-2 h-2 bg-red-500 rounded-full"></span>
);
