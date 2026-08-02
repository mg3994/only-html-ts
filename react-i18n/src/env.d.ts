declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.arb" {
  const value: Record<string, any>;
  export default value;
}

declare module "*.arb.json" {
  const value: Record<string, any>;
  export default value;
}

// Add global declaration for process
declare var process: {
  env: {
    NODE_ENV: string;
    [key: string]: string | undefined;
  };
};
