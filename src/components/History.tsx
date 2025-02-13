interface Params {
  example: string;
}

export const History = ({ example }: Params) => {
  return <div>{example}</div>;
};
