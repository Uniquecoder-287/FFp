document.getElementById('mySelect').addEventListener('change', function() {
    const selectedValue = this.value;
    document.querySelectorAll('ul').forEach(ul => {
      ul.classList.remove('visible-list');
      ul.classList.add('hidden-list');
    });
    document.getElementById(selectedValue).classList.remove('hidden-list');
    document.getElementById(selectedValue).classList.add('visible-list');
  });