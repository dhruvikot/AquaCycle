import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    ...(Platform.OS === 'web' && {
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }),
  },
  scrollView: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
      minHeight: 0,
    }),
  },
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    paddingTop: 0, // Remove paddingTop
  },
  topRectangle: {
    height: 10,
    backgroundColor: 'darkblue',
    width: '150%',
    marginTop: 0,
    position: 'absolute',
    top: 0,
  },
  additionalRectangle: {
    height: 10,
    backgroundColor: 'darkblue',
    width: '150%',
    marginTop: 100, // Adjust marginTop to 10 to separate from the top rectangle
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -50, // Move the header up
  },
  headerText: {
    fontSize: 24,
    marginBottom: 10, // Adjust marginBottom
  },
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    marginTop: 10, // Move the pickers up
  },
  pickerContainer: {
    flex: 1,
    borderColor: 'darkblue',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 5,
    paddingVertical: 10,
  },
  materialContainer: {
    marginBottom: 10,
    padding: 10,
    marginTop: 10,
  },
  material: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20, 
    borderRadius: 10,
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  weightInput: {
    width: 80,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
    paddingHorizontal: 8,
    fontSize: 16,
    backgroundColor: 'white',
  },
  kgText: {
    marginLeft: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 90, // Decrease marginTop to move buttons up
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: 'lightgreen',
    padding: 8,
    width: '49%',
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: 'grey',
    padding: 8,
    width: '49%',
  },
  commentInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10, // Move the comment input up
  },
  logo: {
    height: 50,
    resizeMode: 'contain',
    marginBottom: 20,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  materialContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  weightText: {
    marginRight: 10,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  colorRectangle: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
  materialName: {
    flex: 1,
    fontSize: 16,
  },
  summaryContainer: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  totalWeightText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalWeightError: {
    color: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default styles;

