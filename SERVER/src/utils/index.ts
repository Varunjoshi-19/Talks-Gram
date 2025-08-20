import { autoInjectable } from "tsyringe";

@autoInjectable()
class allHelpServices {

    shufflePosts(allPosts: any) {

        for (let i = allPosts.length - 1; i > 0; i--) {

            const randomIndex = Math.floor(Math.random() * (i + 1));

            [allPosts[i], allPosts[randomIndex]] = [allPosts[randomIndex], allPosts[i]];

        }

        return allPosts;
    }

}

export default allHelpServices






