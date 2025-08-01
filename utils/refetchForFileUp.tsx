// import { useQueryClient } from "@tanstack/react-query";

// const refetchUploads = async () => {
//   const queryClient = useQueryClient();
//   const uploadsQuery = queryClient.getQueryState(["uploads"]);
//   if (uploadsQuery) {
//     await queryClient.refetchQueries({ queryKey: ["uploads"] });
//   }
// };

// export default refetchUploads

import { useQueryClient } from "@tanstack/react-query";

export const useRefetchUploads = () => {
  const queryClient = useQueryClient();

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["uploads"] });
  };

  return refetch;
};
