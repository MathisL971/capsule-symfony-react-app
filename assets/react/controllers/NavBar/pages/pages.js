const getLoggedInPages = (role) => {
  let pages = [];

  switch (role) {
    case "ado":
      pages = [
        { name: "home", developed: true },
        { name: "journal", developed: false },
        {
          name: "ressources",
          developed: false,
          subnames: [
            { name: "videos", developed: false },
            { name: "podcasts", developed: false },
            { name: "audiobooks", developed: false },
          ],
        },
        { name: "messages", developed: true },
        { name: "family", developed: false },
        { name: "news", developed: false },
        { name: "notes", developed: false },
        { name: "community", developed: false },
        { name: "timing", developed: false },
        { name: "visio", developed: false },
      ];
      break;
    case "parent":
      pages = [
        { name: "home", developed: true },
        { name: "journal", developed: false },
        {
          name: "ressources",
          developed: false,
          subnames: [
            { name: "videos", developed: false },
            { name: "podcasts", developed: false },
            { name: "audiobooks", developed: false },
          ],
        },
        { name: "messages", developed: true },
        { name: "family", developed: false },
        { name: "news", developed: false },
        { name: "notes", developed: false },
        { name: "community", developed: false },
        { name: "timing", developed: false },
        { name: "visio", developed: false },
      ];
      break;
    case "pro":
      pages = [
        { name: "home", developed: true },
        { name: "agenda", developed: false },
        { name: "patients", developed: false },
        { name: "messages", developed: true },
        { name: "notes", developed: false },
        { name: "capsule_tv", developed: false },
      ];
      break;
    case "admin":
      pages = [
        { name: "home", developed: true },
        { name: "agenda", developed: false },
        { name: "visio2", developed: true },
        { name: "users", developed: true },
        { name: "ressources", developed: true },
        { name: "textes", developed: true },
        { name: "revue", developed: false },
        { name: "support", developed: false },
      ];
      break;
    default:
  }

  return pages;
};

export const loggedOutPages = [
  { name: "ados", url: "profil_jeune", developed: true },
  { name: "parents", url: "profil_parent", developed: true },
  { name: "professionels", url: "profil_pro", developed: true },
];

export default getLoggedInPages;
