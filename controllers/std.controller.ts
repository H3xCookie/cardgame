import pool from "../dbConfig";

const makeid = (idlen: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < idlen) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const getUsernameById = async(id: any) => {
	const query: any = await pool.query('SELECT * FROM player WHERE p_id = $1', [id])
	if(query.rows.length == 0){
		return -1;
	}else{
		return query.rows[0].p_username;
	}
}

function shuffle(array: any) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex > 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


export {makeid, getUsernameById, shuffle}