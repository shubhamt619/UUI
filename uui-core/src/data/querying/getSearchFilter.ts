const extractRank = (matches: (false | (false | number[])[])[], textsCount: number, groupWordLength: number[]) => {
    if (!matches) return false;

    return matches.flatMap((match, index) => {
        if (!match) {
            return Array(groupWordLength[index] * textsCount).fill(null);
        }
        return match;
    }).flatMap((match) => match);
};

export function getSearchFilter(searchString: string): (texts: string[]) => boolean | Array<number | null> {
    if (!searchString) {
        return () => true;
    }
    const searchStr = searchString.replace(/[\s\n\r\t\0]+/g, ' ').trim(); // trim and normalize whitespaces

    // split by comma-separated groups, then by spaces, and make regex of each word
    const wordGroups = searchStr
        .split(',')
        .map((words) =>
            words
                .split(' ')
                .map((word) => word.trim())
                .filter((s) => s.length > 0)
                .map((word) => word.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')) // esape regex characters inside the string
                .map((word) => new RegExp(word, 'i')))
        .filter((g) => g.length > 0);

    return (texts) => {
        if (!wordGroups.length) {
            return true;
        }

        const matchesByGroups = wordGroups.map((wordRegexes) => {
            const matches = wordRegexes.map((wordRegex) => {
                // matching regex word with fields values
                const wordMatches = texts.map((text) => text.match(wordRegex));

                // if keyword was not found in every field value
                if (wordMatches.every((match) => match === null)) {
                    return false;
                }
                return wordMatches.map((match) => match !== null ? match.index : null);
            });

            // some keyword of a group was not found in fields values
            if (matches.some((match) => !match)) {
                return false;
            }

            return matches;
        });

        // if every group matching is failed
        if (matchesByGroups.every((matchByGroup) => matchByGroup === false)) {
            return false;
        }

        return extractRank(matchesByGroups, texts.length, wordGroups.map((wordGroup) => wordGroup.length));
    };
}
