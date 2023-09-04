const getLoggedInPages = (role) => {
  let pages = [];

  switch (role) {
    case "ado":
      pages = [
        { name: "dashboard", url: "home", developed: true },
        { name: "journal", url: "journal", developed: false },
        {
          name: "ressources",
          url: "ressources",
          developed: false,
          suburls: [
            { name: "videos", url: "videos", developed: false },
            { name: "balados", url: "podcasts", developed: false },
            { name: "livres audios", url: "audiobooks", developed: false },
          ],
        },
        { name: "messagerie", url: "messages", developed: true },
        { name: "famille", url: "family", developed: false },
        { name: "nouvelles", url: "news", developed: false },
        { name: "notes", url: "notes", developed: false },
        { name: "communauté", url: "community", developed: false },
        { name: "timing", url: "timing", developed: false },
        { name: "conférence", url: "visio", developed: false },
      ];
      break;
    case "parent":
      pages = [
        { name: "dashboard", url: "home", developed: true },
        { name: "journal", url: "journal", developed: false },
        {
          name: "ressources",
          url: "ressources",
          developed: false,
          suburls: [
            { name: "videos", url: "videos", developed: false },
            { name: "balados", url: "podcasts", developed: false },
            { name: "livres audios", url: "audiobooks", developed: false },
          ],
        },
        { name: "messagerie", url: "messages", developed: true },
        { name: "famille", url: "family", developed: false },
        { name: "nouvelles", url: "news", developed: false },
        { name: "notes", url: "notes", developed: false },
        { name: "communauté", url: "community", developed: false },
        { name: "timing", url: "timing", developed: false },
        { name: "conférence", url: "visio", developed: false },
      ];
      break;
    case "pro":
      pages = [
        { name: "dashboard", url: "home", developed: true },
        { name: "agenda", url: "agenda", developed: false },
        { name: "réseau", url: "patients", developed: false },
        { name: "messagerie", url: "messages", developed: true },
        { name: "notes", url: "notes", developed: false },
        { name: "enregistrements", url: "capsule_tv", developed: false },
      ];
      break;
    case "admin":
      pages = [
        { name: "dashboard", url: "home", developed: true },
        { name: "agenda", url: "agenda", developed: true },
        { name: "conférence", url: "visio2", developed: true },
        { name: "utilisateurs", url: "users", developed: true },
        { name: "ressources", url: "ressources", developed: true },
        { name: "textes", url: "textes", developed: false },
        { name: "nouvelles", url: "revue", developed: false },
        { name: "support", url: "support", developed: false },
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
