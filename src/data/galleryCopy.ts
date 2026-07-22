import type { SectionCopy } from "@/types";

export const galleryCopy: SectionCopy = {
  headline: "Sekilas Kehidupan Kerajaan",
  body: "Dokumentasi keindahan alam, kemegahan kastil, kesibukan pasar, dan pertempuran epik langsung dari kamera petualang di server kami.",
};

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  file: string;
  desc: string;
  lore: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Benteng Sang Raja",
    category: "Kastil",
    file: "/assets/images/gallery/benteng_sang_raja.jpeg",
    desc: "Sebuah benteng megah menjulang di jantung lembah yang dikelilingi hutan dan sungai, menjadi pusat pemerintahan serta simbol kejayaan Kerajaan RZ Survival.",
    lore: "Di balik tembok batu yang kokoh, takhta para penguasa diwariskan dari satu generasi ke generasi berikutnya melalui sumpah para kesatria. Konon, menara tertinggi menyimpan relik berenergi mistis yang melindungi seluruh kerajaan dari ancaman reruntuhan kuno dan pasukan yang datang dari negeri-negeri seberang, sehingga kejayaan klan tetap abadi sepanjang zaman.",
  },
  {
    id: 2,
    title: "Fajar Kejayaan",
    category: "Keindahan Alam",
    file: "/assets/images/gallery/fajar_kejayaan.jpeg",
    desc: "Di bawah cahaya fajar yang menyinari perbukitan hijau, para pengembara RZ Survival berdiri bersama sebagai lambang lahirnya sebuah era baru yang akan dikenang dalam lembaran sejarah kerajaan.",
    lore: "Konon, saat matahari pertama menyentuh cakrawala, para kesatria dari berbagai klan berkumpul untuk mengikrarkan sumpah di hadapan takhta yang belum memiliki penguasa. Sejak hari itu, energi mistis senja dan harapan kejayaan menyatu, menjadi awal dari legenda besar yang terus diwariskan kepada setiap penjelajah yang menginjakkan kaki di negeri RZ Survival.",
  },
  {
    id: 3,
    title: "Mahkota Fajar",
    category: "Keindahan Alam",
    file: "/assets/images/gallery/mahkota_fajar.jpeg",
    desc: "Seorang pengembara berjubah menatap ufuk timur yang diterangi cahaya mentari, seolah menjadi saksi bisu dimulainya babak baru dalam sejarah kerajaan.",
    lore: "Dahulu, hanya pewaris takhta yang berani berdiri di tepian pantai suci saat fajar pertama menyingsing. Diyakini bahwa sinar tersebut membawa energi mistis yang membimbing para kesatria menuju kejayaan klan, sementara mereka yang mengkhianati sumpah akan lenyap ditelan kabut lautan selamanya.",
  },
  {
    id: 4,
    title: "Sumpah Senja",
    category: "Pertempuran",
    file: "/assets/images/gallery/sumpah_senja.jpeg",
    desc: "Enam sosok pejuang berdiri mengelilingi seorang pemegang kekuatan misterius di tengah cahaya senja, menandai dimulainya sebuah ikrar yang tercatat dalam arsip kerajaan.",
    lore: "Di pulau kecil yang dikelilingi air tenang, para kesatria dari berbagai klan mengucapkan sumpah di hadapan artefak yang memancarkan energi mistis. Konon, ikrar itu menjadi awal dari peperangan besar yang menentukan siapa yang kelak berhak menduduki takhta, sementara nama para pengkhianat dihapus dari seluruh kronik kerajaan.",
  },
  {
    id: 5,
    title: "Takhta Persatuan",
    category: "Kastil",
    file: "/assets/images/gallery/takhta_persatuan.jpeg",
    desc: "Para penjaga kerajaan berkumpul di atas pelataran batu yang menghadap lembah hijau, melambangkan kokohnya persatuan di bawah panji RZ Survival.",
    lore: "Setelah bertahun-tahun menghadapi pertempuran dan menjelajahi reruntuhan kuno, para kesatria dari berbagai klan dipanggil untuk menghadap takhta dan memperbarui sumpah kesetiaan mereka. Cahaya yang menembus langit diyakini sebagai berkah dari energi mistis leluhur, pertanda bahwa kejayaan klan akan terus bertahan selama persatuan tidak pernah terpecah.",
  },
  {
    id: 6,
    title: "Gerbang Astral",
    category: "Dungeon",
    file: "/assets/images/gallery/gerbang_astral.jpeg",
    desc: "Sejumlah petualang berkumpul di hadapan gerbang bercahaya ungu yang diyakini sebagai peninggalan peradaban kuno, sebelum memulai ekspedisi menuju wilayah yang belum pernah dipetakan.",
    lore: "Di bawah reruntuhan benteng tua, berdiri sebuah gerbang yang dipenuhi energi mistis dan hanya terbuka ketika para kesatria datang dengan tekad yang sama. Legenda menyebutkan bahwa siapa pun yang berhasil melewati ambangnya akan menemukan rahasia kejayaan klan, namun banyak pula yang tak pernah kembali dari kegelapan di balik portal tersebut.",
  },
  {
    id: 7,
    title: "Taman Mahkota",
    category: "Keindahan Alam",
    file: "/assets/images/gallery/taman_mahkota.jpeg",
    desc: "Sebuah permukiman megah berdiri di tengah hamparan pepohonan berbunga, menjadi permata kerajaan yang dikelilingi tebing tinggi dan hutan yang subur.",
    lore: "Dikisahkan bahwa lembah ini dahulu merupakan taman suci tempat para raja menerima restu sebelum menduduki takhta. Saat musim bunga tiba, energi mistis mengalir melalui setiap kelopak, membawa kedamaian bagi kejayaan klan dan mengusir segala kegelapan yang berani mendekat.",
  },
  {
    id: 8,
    title: "The Chronicle Begins",
    category: "Pertempuran",
    file: "/assets/images/gallery/the_chronicle_begins.png",
    desc: "Empat pejuang klan LuminHollow berdiri di hadapan menara yang dulu menjadi medan kehancuran mereka, menandai kebangkitan setelah kekalahan yang nyaris menghapus nama mereka dari sejarah.",
    lore: "Konon, markas mereka pernah diruntuhkan hingga rata dengan tanah, dan nyala api melahap nyaris seluruh jejak yang pernah mereka tinggalkan. Namun klan LuminHollow memilih bangkit—melalui kesabaran, persiapan matang, dan tekad yang tak pernah padam, mereka kembali menghadapi klan yang dahulu menjatuhkan mereka. Pertempuran sengit itu berakhir bukan dengan sorak kemenangan, melainkan keheningan empat pejuang yang menyadari: kejayaan ini hanyalah permulaan dari perjalanan yang jauh lebih panjang.",
  },
  {
    id: 9,
    title: "Awal Sebuah Petualangan",
    category: "Keindahan Alam",
    file: "/assets/images/gallery/awal_sebuah_petualangan.jpeg",
    desc: "Seorang petualang menatap kuil kuno yang berdiri di kaki pegunungan bersalju, memulai perjalanan seorang diri untuk mencari harta karun yang telah lama tersembunyi.",
    lore: "Dengan keberanian dan tekad yang kuat, sang petualang menjelajahi hutan lebat, menyeberangi sungai deras, dan mendaki pegunungan yang menjulang tanpa rasa gentar. Konon, harta karun legendaris yang ia cari mampu mengubah takdir siapa pun yang berhasil menemukannya—namun baginya, perjalanan ini bukan sekadar mencari kekayaan, melainkan awal dari sebuah kisah besar yang akan mengubah hidupnya selamanya.",
  },
  {
    id: 10,
    title: "Bersama Menuju Horizon",
    category: "Keindahan Alam",
    file: "/assets/images/gallery/bersama_menuju_horizon.jpeg",
    desc: "Dua petualang berhenti sejenak di tepi danau untuk menikmati senja, mengenang perjalanan yang telah mereka lalui dan menatap masa depan yang masih menanti.",
    lore: "Di bawah langit yang dihiasi cahaya senja, dua sahabat berdiri dalam keheningan. Tak ada kata yang perlu diucapkan, karena setiap langkah yang telah mereka tempuh telah menjadi kisah yang hanya mereka berdua pahami. Mereka telah melewati hutan yang gelap, mendaki pegunungan yang menjulang, dan menghadapi berbagai tantangan yang menguji keberanian mereka. Kini, di tepi danau yang tenang, mereka menyadari bahwa perjalanan bukan hanya tentang mencapai tujuan, tetapi juga tentang setiap kenangan yang tercipta di sepanjang jalan. Saat matahari perlahan tenggelam di balik cakrawala, mereka tahu bahwa esok akan membawa petualangan baru. Dan selama mereka masih melangkah bersama, tidak ada perjalanan yang terasa mustahil. \"Setiap matahari terbenam bukanlah akhir, melainkan awal dari perjalanan berikutnya.\"",
  },
  {
    id: 11,
    title: "Akhir Sebuah Era",
    category: "Komunitas",
    file: "/assets/images/gallery/akhir_sebuah_era.png",
    desc: "Momen terakhir para penghuni kerajaan sebelum berakhirnya Season 1. Sebuah foto yang menjadi saksi perjalanan, persahabatan, dan sejarah yang telah mereka ukir bersama.",
    lore: "Di atas menara yang menghadap seluruh penjuru kerajaan, mereka berkumpul untuk terakhir kalinya. Di balik senyum yang terlihat, tersimpan ribuan kenangan yang tak akan pernah terlupakan. Dari rumah sederhana hingga kastel yang megah, dari peralatan kayu hingga perlengkapan terbaik, semuanya dibangun melalui kerja keras, tawa, dan perjuangan bersama. Setiap sudut kerajaan menyimpan cerita tentang pertemuan, petualangan, peperangan, dan persahabatan yang tumbuh sepanjang perjalanan. Season 1 akhirnya mencapai penghujungnya. Dunia yang telah menjadi rumah bagi begitu banyak kisah akan segera menutup lembarannya. Namun, meski kerajaan ini akan dikenang sebagai bagian dari masa lalu, kenangan yang tercipta di dalamnya akan tetap hidup di hati setiap petualang. Foto ini bukan sekadar potret bersama. Ini adalah akhir dari sebuah era, sekaligus awal dari babak baru yang akan ditulis pada Season berikutnya. \"Setiap akhir bukanlah perpisahan, melainkan awal dari kisah yang lebih besar.\"",
  },
  {
    id: 12,
    title: "Bridge of Triumph",
    category: "Arsitektur",
    file: "/assets/images/gallery/bridge_of_triumph.png",
    desc: "Jembatan megah yang berhasil meraih kemenangan dalam lomba pembangunan, menjadi simbol kreativitas, kerja keras, dan kejayaan para pembangunnya.",
    lore: "Di antara dua tebing yang dipisahkan oleh jurang yang dalam, lahirlah sebuah mahakarya yang menghubungkan harapan menjadi kenyataan. Batu demi batu, balok demi balok, disusun dengan penuh ketelitian hingga berdirilah sebuah jembatan megah yang memukau setiap mata yang memandang. Saat lomba pembangunan diumumkan, karya ini berhasil mencuri perhatian para juri. Bukan hanya karena kemegahan menara dan detail arsitekturnya, tetapi juga karena mampu menyatu dengan alam di sekitarnya, menciptakan pemandangan yang begitu indah dan berkesan. Kemenangan ini menjadi bukti bahwa sebuah bangunan bukan sekadar susunan balok, melainkan hasil dari kreativitas, dedikasi, dan semangat yang dituangkan dalam setiap detailnya. Kini, jembatan itu bukan hanya menjadi penghubung dua sisi jurang, tetapi juga menjadi saksi bisu atas salah satu pencapaian terbesar dalam sejarah kerajaan. \"Sebuah jembatan tidak hanya menghubungkan dua tempat, tetapi juga menghubungkan mimpi dengan kenyataan.\"",
  },
  {
    id: 13,
    title: "Sebuah Pertemuan, Ribuan Kenangan",
    category: "Komunitas",
    file: "/assets/images/gallery/sebuah_pertemuan_ribuan_kenangan.png",
    desc: "Sekelompok petualang berkumpul di satu tempat, tanpa menyadari bahwa pertemuan sederhana itu akan melahirkan begitu banyak cerita.",
    lore: "Tak ada yang tampak istimewa pada hari itu. Hanya beberapa petualang yang berdiri di sebuah jalan batu, saling menyapa dan berbincang tentang rencana yang ingin mereka wujudkan. Sebagian datang dengan perlengkapan seadanya, sebagian lainnya baru saja memulai perjalanan. Belum ada kastel yang menjulang tinggi, belum ada kota megah, dan belum ada nama besar yang dikenang. Yang mereka miliki hanyalah semangat untuk bermain dan membangun bersama. Hari demi hari berlalu. Jalan kecil itu perlahan berkembang menjadi pusat kehidupan. Rumah-rumah mulai berdiri, pelabuhan mulai ramai, dan persahabatan yang terjalin melahirkan begitu banyak kisah yang tak terlupakan. Tak seorang pun menyangka bahwa pertemuan sederhana itu akan menjadi awal dari sejarah panjang yang terus dikenang hingga hari ini. \"Semua kenangan besar selalu berawal dari sebuah pertemuan sederhana.\"",
  },
];
