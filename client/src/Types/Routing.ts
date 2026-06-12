export const ROUTES = {
"IntroPage":'/',
"Main_Page":'/Main_page',
"ParentLogin":'/ParentLogin',
"ParentSignup":'/ParentSignup',
"About":'/About',
}as const;
  
  // This creates a union type of all possible route keys
  // RouteKey = "HOME" | "ABOUT" | "FEATURES" | "LOGIN" | "SIGNUP" | "MAIN_PAGE"
  export type RouteKey = keyof typeof ROUTES;