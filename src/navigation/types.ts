export type AuthStackParamList = {
  Auth: undefined;
};

export type BottomTabParamList = {
  Discover: undefined;
  Search: undefined;
  Watchlist: undefined;
};


export type AppStackParamList = {
  Tabs: BottomTabParamList;
  MovieDetails: { id: number, title: string };
  Account: undefined;
};
  

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}