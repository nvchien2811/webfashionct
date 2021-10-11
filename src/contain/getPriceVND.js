export const getPriceVND = (giatri) => {
    try {
        const parts = giatri.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const gia = parts.join(".");
        return gia;
    } catch (error) {
        
    }
  
}