DROP TABLE IF EXISTS to_do_list;
DROP TABLE IF EXISTS user_data;

CREATE TABLE to_do_list (
    id SERIAL,
    task TEXT,
    description TEXT,
    urgent BOOLEAN,
    completed BOOLEAN,
    user_id INTEGER
);

CREATE TABLE user_data(
    id SERIAL,
    name TEXT
);