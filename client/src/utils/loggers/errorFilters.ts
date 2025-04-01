// TODO: not working check why
export const filterStripeConsoleErrors = () => {
  const originalConsoleError = console.error;
  console.error = function (...args) {
      if (!args[0]?.includes("r.stripe.com")) {
          originalConsoleError.apply(console, args);
      }
  };
}
