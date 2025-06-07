import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"

export function PaginationEx({pageNo, setPageNo, maxLimit, currentFetchedProblemsCount, currProbLen}) {
  
    const gotoPrev = () => {
        if(pageNo > 0) {
            setPageNo(pageNo - 1)
        }
    }

    const gotoNext = () => {
        if(pageNo+1 < Math.min(maxLimit, Math.ceil(currProbLen/5))) {
            setPageNo(pageNo + 1)
        }
    }
  
    return currentFetchedProblemsCount > 0 ? (
    <Pagination>
      <PaginationContent>
        
        <PaginationItem>
          <PaginationPrevious onClick={gotoPrev} />
        </PaginationItem>
        

        {
            pageNo!==0 ?
            <PaginationItem>
                <PaginationEllipsis />
            </PaginationItem>
            : ""
        }

        
        <PaginationItem>
          <PaginationLink onClick={() => setPageNo(pageNo)} isActive>{pageNo + 1}</PaginationLink>
        </PaginationItem>
        
        
        {
            pageNo+2 <= Math.min(maxLimit, Math.ceil(currProbLen/5)) ?
            <PaginationItem>
                <PaginationLink onClick={() => setPageNo(pageNo+1)}>{pageNo + 2}</PaginationLink>
            </PaginationItem>
            : ""
        }

        {
            pageNo+3 <= Math.min(maxLimit, Math.ceil(currProbLen/5)) ?
            <PaginationItem>
                <PaginationLink onClick={() => setPageNo(pageNo+2)}>{pageNo + 3}</PaginationLink>
            </PaginationItem>
            : ""
        }


        {
            pageNo+3 < Math.min(maxLimit, Math.ceil(currProbLen/5)) ?
            <PaginationItem>
                <PaginationEllipsis />
            </PaginationItem>
            : ""
        }
        
        <PaginationItem>
          <PaginationNext onClick={gotoNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
  : null
}
