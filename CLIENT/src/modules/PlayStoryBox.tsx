import { X } from "lucide-react";
import sharePostStyle from "../Styling/ShareDilog.module.css";
import storyStyle from "../Styling/StoryDilog.module.css";
import { useEffect, useState } from "react";
import { PlayStoryProps } from "../Interfaces";
import StoryCard from "./StoryCard";
import LoadingScreen from "../Components/LoadingScreen";

function PlayStoryBox({ allStories, currentSelectedStory, closeDilogBox }: PlayStoryProps) {
    const [currentStory, setCurrentStory] = useState<number>(0);

    useEffect(() => {
        setCurrentStory(currentSelectedStory.currentIndex);
    }, [currentSelectedStory.currentIndex]);

    useEffect(() => {
        if (!allStories || allStories.length === 0) {
            window.history.replaceState({}, "", "/");
            return;
        }

        if (currentStory > allStories.length - 1) {
            window.history.replaceState({}, "", "/");
            closeDilogBox(false);
            return;
        }

        const duration = allStories[currentStory]?.storyData?.duration || 3000;

        const timer = setTimeout(() => {
            setCurrentStory(prev => prev + 1);
        }, duration);

        return () => clearTimeout(timer);
    }, [currentStory, allStories]);

    const getClassName = (index: number) => {
        if (index === currentStory) return { name: storyStyle.activeStory, positions: "center" };
        if (index === currentStory - 1 || index === currentStory + 1) return { name: storyStyle.sideStoryLarge, positions: "side" };
        if (index === currentStory - 2 || index === currentStory + 2) return { name: storyStyle.sideStoryLarge, positions: "side" };
        return { name: storyStyle.hiddenStory, positions: "hidden" };
    };

    if (!allStories) return <LoadingScreen />;

    return (
        <div className={sharePostStyle.blackBehindContainer} style={{ background: "black" }}>
            <div className={sharePostStyle.crossButton}>
                <X onClick={() => {
                    window.history.replaceState({}, "", "/");
                    closeDilogBox(prev => !prev);
                }} />
            </div>

            <div className={storyStyle.storyContainer}>
                {allStories.map((story, index) => {
                    const className = getClassName(index);
                    if (className.name === storyStyle.hiddenStory) return null;
                    return (
                        <div key={story._id} onClick={() => setCurrentStory(index)} className={className.name}>
                            <StoryCard
                                setCurrentStory={setCurrentStory}
                                currentStory={currentStory}
                                closeDilogBox={closeDilogBox}
                                allStoriesLength={allStories.length - 1}
                                story={story}
                                index={index}
                                logoIcon={className.positions === "side" ? story.userId : null}
                                className={className}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PlayStoryBox;
