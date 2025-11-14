import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
    marginTop: 10, // Move the material container up
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
    width: 60,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
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
  },
});

export default styles;

