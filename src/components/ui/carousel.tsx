// Import React library and hooks.
import * as React from "react";
// Import useEmblaCarousel hook and its types from embla-carousel-react for carousel functionality.
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
// Import ArrowLeft and ArrowRight icons from lucide-react for navigation buttons.
import { ArrowLeft, ArrowRight } from "lucide-react";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";
// Import Button component for navigation controls.
import { Button } from "@/components/ui/button";

// Define types related to Embla Carousel for better type safety and readability.
type CarouselApi = UseEmblaCarouselType[1]; // Type for the Embla Carousel API.
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>; // Type for parameters of useEmblaCarousel.
type CarouselOptions = UseCarouselParameters[0]; // Type for Embla Carousel options.
type CarouselPlugin = UseCarouselParameters[1]; // Type for Embla Carousel plugins.

// Define props for the main Carousel component.
type CarouselProps = {
  opts?: CarouselOptions; // Optional Embla Carousel options.
  plugins?: CarouselPlugin; // Optional Embla Carousel plugins.
  orientation?: "horizontal" | "vertical"; // Orientation of the carousel, defaults to horizontal.
  setApi?: (api: CarouselApi) => void; // Optional callback to get the Embla Carousel API instance.
};

// Define props for the CarouselContext, which provides carousel state and controls to child components.
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]; // Ref for the carousel container.
  api: ReturnType<typeof useEmblaCarousel>[1]; // Embla Carousel API instance.
  scrollPrev: () => void; // Function to scroll to the previous slide.
  scrollNext: () => void; // Function to scroll to the next slide.
  canScrollPrev: boolean; // Boolean indicating if scrolling to previous slide is possible.
  canScrollNext: boolean; // Boolean indicating if scrolling to next slide is possible.
} & CarouselProps; // Inherits props from CarouselProps.

// Create a React context for the carousel.
const CarouselContext = React.createContext<CarouselContextProps | null>(null);

// Custom hook to access the CarouselContext.
// Throws an error if used outside of a <Carousel /> component.
function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

// Main Carousel component.
// It initializes Embla Carousel and provides context to its children.
// Accepts standard HTML div props and CarouselProps.
function Carousel({
  orientation = "horizontal", // Default orientation.
  opts, // Embla options.
  setApi, // Callback for API instance.
  plugins, // Embla plugins.
  className, // Additional CSS classes.
  children, // Child components (CarouselContent, CarouselPrevious, CarouselNext).
  ...props // Spread other div props.
}: React.ComponentProps<"div"> & CarouselProps) {
  // Initialize Embla Carousel with options and plugins.
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y", // Set axis based on orientation.
    },
    plugins
  );
  // State to track if scrolling previous/next is possible.
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  // Callback function called when a slide is selected or carousel is re-initialized.
  // Updates canScrollPrev and canScrollNext state.
  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  // Callback to scroll to the previous slide.
  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  // Callback to scroll to the next slide.
  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  // Callback to handle keyboard navigation (ArrowLeft and ArrowRight).
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  // Effect to pass the Embla API instance via setApi callback when API or setApi changes.
  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  // Effect to register event listeners for 'select' and 'reInit' events on the Embla API.
  // Cleans up listeners on component unmount.
  React.useEffect(() => {
    if (!api) return;
    onSelect(api); // Initial check for scrollability.
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect); // Cleanup.
    };
  }, [api, onSelect]);

  return (
    // Provide carousel context to child components.
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"), // Determine orientation from props or opts.
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      {/* Root div for the carousel with keyboard navigation and ARIA attributes. */}
      <div
        onKeyDownCapture={handleKeyDown} // Capture keydown events for navigation.
        className={cn("relative", className)} // Apply relative positioning and custom classes.
        role="region" // ARIA role for a region.
        aria-roledescription="carousel" // ARIA description for carousel.
        data-slot="carousel" // Custom data attribute.
        {...props} // Spread other div props.
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

// CarouselContent component: Container for carousel items.
// Accepts standard HTML div props.
function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  // Get carouselRef and orientation from context.
  const { carouselRef, orientation } = useCarousel();

  return (
    // Div that Embla Carousel uses for its viewport.
    <div
      ref={carouselRef} // Assign ref for Embla.
      className="overflow-hidden" // Hide overflowing content.
      data-slot="carousel-content" // Custom data attribute.
    >
      {/* Inner div that holds the carousel items. */}
      <div
        // Apply flex layout and negative margin based on orientation to hide scrollbar and manage spacing.
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props} // Spread other div props.
      />
    </div>
  );
}

// CarouselItem component: Wrapper for individual carousel slides.
// Accepts standard HTML div props.
function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  // Get orientation from context.
  const { orientation } = useCarousel();

  return (
    <div
      role="group" // ARIA role for a group of related elements.
      aria-roledescription="slide" // ARIA description for a slide.
      data-slot="carousel-item" // Custom data attribute.
      // Apply styles for sizing and spacing based on orientation.
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full", // Base styles for item sizing.
        orientation === "horizontal" ? "pl-4" : "pt-4", // Padding based on orientation.
        className
      )}
      {...props} // Spread other div props.
    />
  );
}

// CarouselPrevious component: Button to navigate to the previous slide.
// Accepts Button component props.
function CarouselPrevious({
  className,
  variant = "outline", // Default button variant.
  size = "icon", // Default button size.
  ...props
}: React.ComponentProps<typeof Button>) {
  // Get orientation, scrollPrev function, and canScrollPrev state from context.
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous" // Custom data attribute.
      variant={variant}
      size={size}
      // Apply styles for absolute positioning and rotation based on orientation.
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2" // Horizontal positioning.
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90", // Vertical positioning.
        className
      )}
      disabled={!canScrollPrev} // Disable button if cannot scroll previous.
      onClick={scrollPrev} // Click handler to scroll previous.
      {...props} // Spread other Button props.
    >
      <ArrowLeft /> {/* Left arrow icon. */}
      <span className="sr-only">Previous slide</span> {/* Screen-reader only text. */}
    </Button>
  );
}

// CarouselNext component: Button to navigate to the next slide.
// Accepts Button component props.
function CarouselNext({
  className,
  variant = "outline", // Default button variant.
  size = "icon", // Default button size.
  ...props
}: React.ComponentProps<typeof Button>) {
  // Get orientation, scrollNext function, and canScrollNext state from context.
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next" // Custom data attribute.
      variant={variant}
      size={size}
      // Apply styles for absolute positioning and rotation based on orientation.
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2" // Horizontal positioning.
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", // Vertical positioning.
        className
      )}
      disabled={!canScrollNext} // Disable button if cannot scroll next.
      onClick={scrollNext} // Click handler to scroll next.
      {...props} // Spread other Button props.
    >
      <ArrowRight /> {/* Right arrow icon. */}
      <span className="sr-only">Next slide</span> {/* Screen-reader only text. */}
    </Button>
  );
}

// Export all Carousel components and the CarouselApi type.
export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
