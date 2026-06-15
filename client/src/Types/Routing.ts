export const ROUTES = {
"IntroPage":'/',
"Main_Page":'/Main_page',
"Staff_Signup":'/Staff_Signup',
"Staff_Login":'/Staff_Login',
"About":'/About',
}as const;
  
  // This creates a union type of all possible route keys
  // RouteKey = "HOME" | "ABOUT" | "FEATURES" | "LOGIN" | "SIGNUP" | "MAIN_PAGE"
  export type RouteKey = keyof typeof ROUTES;