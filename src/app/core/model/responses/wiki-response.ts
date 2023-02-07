export interface WikiPage {
  title: string;
  thumbnail: {
    source: string;
  };
}

export interface WikiResponse {
  query: {
    pages: {
      [key: string]: WikiPage;
    };
  };
}
