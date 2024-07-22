const admin = require('firebase-admin');

const serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// ... (sisa kode tetap sama)

const db = admin.database();

const getData = async (path) => {
  try {
    const ref = db.ref(path);
    const snapshot = await ref.once('value');
    return snapshot.val();
  } catch (error) {
    console.error('Error saat mengambil data:', error);
    throw error;
  }
};

const setData = async (path, data) => {
  try {
    const ref = db.ref(path);
    await ref.set(data);
    console.log('Data berhasil disimpan:', data);
  } catch (error) {
    console.error('Error saat menyimpan data:', error);
    throw error;
  }
};

const updateData = async (path, data) => {
  try {
    const ref = db.ref(path);
    await ref.update(data);
    console.log('Data berhasil diperbarui:', data);
  } catch (error) {
    console.error('Error saat memperbarui data:', error);
    throw error;
  }
};

const deleteData = async (path) => {
  try {
    const ref = db.ref(path);
    await ref.remove();
    console.log('Data berhasil dihapus dari path:', path);
  } catch (error) {
    console.error('Error saat menghapus data:', error);
    throw error;
  }
};

const addTask = async (dosen, namaTugas, deadline) => {
  try {
    const tasksRef = db.ref('tasks');
    const newTaskRef = tasksRef.push();
    await newTaskRef.set({
      dosen,
      namaTugas,
      deadline
    });
    console.log('Tugas berhasil ditambahkan:', { dosen, namaTugas, deadline });
  } catch (error) {
    console.error('Error saat menambahkan tugas:', error);
    throw error;
  }
};

const getAllTasks = async () => {
  try {
    const tasksRef = db.ref('tasks');
    const snapshot = await tasksRef.once('value');
    return snapshot.val();
  } catch (error) {
    console.error('Error saat mengambil semua tugas:', error);
    throw error;
  }
};

module.exports = {
  getData,
  setData,
  updateData,
  deleteData,
  addTask,
  getAllTasks
};
