export const getLangId = (language) => {
    const judge0Id = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
    };

    return judge0Id[language.toUpperCase()]
};