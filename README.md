# Intro

Thank you for reviewing the challenge. I made some choices that slightly differentiated from the instructions such as:

- Ability to add/remove favorites in cat cards as well as the modal.
- Breed modal view becomes its own seperate page `/breeds/:breedId`.
- Other small stuff + routing decisions.

# Quick Explanation

- `components/ui` folder contains all the base components used in the project. (They are all [ShadcnUI](https://ui.shadcn.com/) components).
- `hooks/useFavorites.tsx` contains the custom hook for managing favorites.
- `pages` contains all the main pages. They are not the smallest & cut in many different pieces. All useEffects and handlers are in there.
- `.env` is not .gitignored (insecure). I took this decisions so you don't have to set it up on your own, feel free to use my api key. You can choose a different user by changing `VITE_CAT_SUB_ID`
- Cats state is managed by Tanstack Query. I was curious about the results myself.
- Added Virtualization with Tanstack-Virtual for better performance in big cat grids.

# What can improve

I opted to manage state directly with TanStack Query's optimistic updates instead of using context or libraries like Zustand with local storage peristance (also helps for initial favorite state). I wanted to see how it would work out as I have never opted to use Tanstack-Query like this. While this reduced code significantly, it complicated the user experience. Cat favorite states are stored in the query cache, which works well for normal usage but creates race conditions when rapidly toggling favorites. Since we don't store temporary favorite IDs in local state between API calls, rapid interactions can produce unexpected results. This limitation could be addressed with additional state management or fixing up the race conditioning in another way but I deprioritized it due to time constraints.

Also:

- Commit history.
- I have commited the crime of not memoizing many values with useMemo and useCallback.
- Better responsive design.
- Better design in general.
- More componentized code.
- ... there's always something to improve.

## Main Technologies used

Typescript, React-Router, Tanstack-Query, Tanstack-Virtual, Tailwind + ShadcnUI Components

# Outro

Not production ready but I hope it's good enough for what you're looking for. Cheers!
