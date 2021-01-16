const xss = require("xss");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const mapService = {
    getUserNicknameAndMaps(db, user_id) {
        return Promise.all([
            db("users").select("nickname").where({ id: user_id }),
            db("maps")
                .select("map_name", "map_string", "width")
                .where({ user_id }),
        ]);
    },
    addMap(db, mapData) {
        return db
            .insert(mapData)
            .into("maps")
            .returning("*")
            .then((rows) => {
                return rows[0];
            });
    },
    updateMap(db, id, mapData) {
        const { map_name, map_string, width } = mapData;
        const date = new Date();
        return db.raw(
            `UPDATE maps SET map_name = '${map_name}', map_string = '${map_string}', width = ${width}, date_modified = now() WHERE id = ${id}`
        );
    },
    deleteMap(db, user_id, map_name) {
        return db("maps")
            .where({ user_id })
            .andWhere({ map_name })
            .del()
            .then(() => {
                return map_name;
            });
    },
    upsert(db, user_id, map_name) {
        return db
            .select("*")
            .from("maps")
            .where({ user_id })
            .andWhere({ map_name });
    },
};

module.exports = mapService;
